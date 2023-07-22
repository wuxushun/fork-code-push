import React, { Component } from 'react'
import {
	View,
	TouchableOpacity,
	Text,
	StyleSheet,
	DeviceEventEmitter,
	SafeAreaView,
	BackHandler,
	ScrollView,
} from 'react-native'
import CodePush from 'react-native-code-push'
import AsyncStorage from "@react-native-async-storage/async-storage";

const ignorePackageList = ['install']

const envKey = 'CodePushEnvKey*'

const codePushOptions = {
	checkFrequency: CodePush.CheckFrequency.MANUAL,
}

const CodePushSyncEventKey = '_CodePushSyncEventKey'
const CodePushOpenDebugEventKey = '_CodePushOpenDebugEventKey'

export function CodePushSyncEvent() {
	DeviceEventEmitter.emit(CodePushSyncEventKey)
}

export function CodePushOpenDebugEvent() {
	DeviceEventEmitter.emit(CodePushOpenDebugEventKey)
}

export async function getAppVersion() {
	try {
		const nativeConfig = await CodePush.getConfiguration()
		if (!nativeConfig) return ''
		const { appVersion } = nativeConfig
		return `v${appVersion}`
	} catch (e) {
		return ''
	}
}

export async function getVersion() {
	try {
		const result = await CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING)
		if (!result) return '0'
		const { label } = result
		return label.replace('v', '')
	} catch (e) {
		return '0'
	}
}

async function getStorage(key) {
	try {
		const result = await AsyncStorage.getItem(key)
		return JSON.parse(result)
	} catch (e) {
		return null
	}
}

function setStorage(key, data) {
	return AsyncStorage.setItem(key, JSON.stringify(data))
}

function Row(props) {
	const { title, content } = props
	return (
		<View style={styles.row}>
			<Text style={styles.rowTitle}>{String(title)}</Text>
			<Text style={styles.rowContent}>{String(content)}</Text>
		</View>
	)
}

function SelectorRow(props) {
	const { item, selected = false, onPress} = props
	const extendStyles = [styles.point]
	if (selected) extendStyles.push(styles.pointSelected)
	const _onPress = () => {
		onPress && onPress(item)
	}
	return (
		<TouchableOpacity style={styles.selectorRow} onPress={_onPress}>
			<View style={extendStyles}/>
			<Text style={styles.rowContent}>{item.label}</Text>
		</TouchableOpacity>
	)
}

class CodePushStatusView extends Component {
	constructor(props) {
		super(props)
		if (!props.bundleName) {
			console.Error('You should must set the bundleName for props.')
		}
		this.state = {
			buttons: [
				{
					title: '应用',
					onPress: this.applyUpdate,
				},
				{
					title: '手动更新',
					onPress: this.sync,
				},
				{
					title: '设置环境',
					onPress: this.setEnv,
				},
				{
					title: '包信息',
					onPress: this.getUpdateMetadata,
				},
			],
			showCodePush: false,
			syncContent: '',
			envList: [],
			selectedEnv: null,
		}
	}

	componentDidMount = () => {
		this._getEnvInfo()
		this._pushEvent = DeviceEventEmitter.addListener(CodePushSyncEventKey, this.sync)
		this._debugEvent = DeviceEventEmitter.addListener(
			CodePushOpenDebugEventKey,
			this._onDebugPress,
		)
		BackHandler.addEventListener('hardwareBackPress', this._backAction)
	}

	componentWillUnmount = () => {
		this._pushEvent && this._pushEvent.remove()
		this._debugEvent && this._debugEvent.remove()
		BackHandler.removeEventListener('hardwareBackPress', this._backAction)
	}

	getUpdateMetadata = () => {
		CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING).then(
			(metadata) => {
				const _getRowInfo = () => {
					if (!metadata || typeof metadata !== 'object') return 'Running binary version'

					const rows = Object.entries(metadata).reduce((result, next) => {
						const key = next[0]
						if (!ignorePackageList.includes(key)) {
							result.push({
								title: key,
								content: next[1],
							})
						}
						return result
					}, [])

					return (
						<>
							{rows.map((sub, index) => <Row key={index} {...sub}/>)}
						</>
					)
				}
				this.setState({
					syncContent: _getRowInfo(metadata),
					progress: false,
				})
			},
			(error) => {
				this.setState({ syncContent: `Error: ${error}`, progress: false })
			},
		)
	}

	sync = async () => {
		// if (__DEV__) {
		// 	this.setState({ syncContent: 'Code Push Only Running in Release', progress: false })
		// 	return
		// }
		const deploymentKey = await this._getDeploymentKey()
		if (!deploymentKey || deploymentKey === '') {
			this.setState({ syncContent: 'No DeploymentKey Set', progress: false })
			return
		}
		CodePush.sync(
			{
				deploymentKey,
			},
			this._codePushStatusDidChange,
			this._codePushDownloadDidProgress,
		).catch((err) => {
			this.setState({ syncContent: err.message, progress: false })
		})
	}

	setEnv = () => {
		const { envList, selectedEnv } = this.state
		const info = (
			<>
				{
					envList.map((sub, index) => (
							<SelectorRow
								key={index}
								item={sub}
								onPress={this._setEnv}
								selected={sub.deploymentKey === selectedEnv?.deploymentKey}
							/>
						)
					)
				}
			</>
		)
		this.setState({
			syncContent: info,
		})
	}

	applyUpdate = () => {
		CodePush.restartApp(false)
	}

	_getEnvKey = () => `${envKey}-${this.props.bundleName}`

	_setEnv = (item) => {
		setStorage(this._getEnvKey(), item)
		this.setState({
			selectedEnv: item,
		}, () => {
			this.setEnv()
		})
	}

	_getEnvInfo = async () => {
		const { envs } = this.props
		const envList = []
		const result = await CodePush.getConfiguration()
		if (result.deploymentKey) {
			envList.push({
				label: '默认环境',
				deploymentKey: result.deploymentKey,
			})
		}
		if (Array.isArray(envs)) {
			envs.forEach(sub => {
				if (sub.deploymentKey && sub.label) {
					envList.push(sub)
				}
			})
		}
		this.setState({
			envList,
		})
		const selectedEnv = await getStorage(this._getEnvKey())
		if (selectedEnv) {
			this.setState({
				selectedEnv,
			})
		} else if (result.deploymentKey) {
			this.setState({
				selectedEnv: envList[0],
			})
		}
	}

	_backAction = () => {
		const status = this.state.showCodePush
		if (status) {
			this.setState({
				showCodePush: false,
			})
		}
		return status
	}

	_codePushStatusDidChange = (syncStatus) => {
		switch (syncStatus) {
			case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
				this.setState({ syncContent: 'Checking for update.' })
				break
			case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
				this.setState({ syncContent: 'Downloading package.' })
				break
			case CodePush.SyncStatus.AWAITING_USER_ACTION:
				this.setState({ syncContent: 'Awaiting user action.' })
				break
			case CodePush.SyncStatus.INSTALLING_UPDATE:
				this.setState({ syncContent: 'Installing update.' })
				break
			case CodePush.SyncStatus.UP_TO_DATE:
				this.setState({ syncContent: 'App up to date.', progress: false })
				break
			case CodePush.SyncStatus.UPDATE_IGNORED:
				this.setState({ syncContent: 'Update cancelled by user.', progress: false })
				break
			case CodePush.SyncStatus.UPDATE_INSTALLED:
				this.setState({ syncContent: 'Update installed and will be applied on restart.', progress: false })
				break
			case CodePush.SyncStatus.UNKNOWN_ERROR:
				this.setState({ syncContent: 'An unknown error occurred.', progress: false })
				break
			default:
				break
		}
	}

	_codePushDownloadDidProgress = (progress) => {
		this.setState({ progress })
	}

	_getDeploymentKey = async () => {
		const { selectedEnv } = this.state
		return selectedEnv?.deploymentKey || ''
	}

	_onDebugPress = () => {
		this._switchStatus()
	}

	_switchStatus = () => {
		this.setState({
			showCodePush: !this.state.showCodePush,
		})
	}

	_renderButton = (item) => (
		<TouchableOpacity key={item.title} onPress={item.onPress}>
			<Text style={styles.button}>{item.title}</Text>
		</TouchableOpacity>
	)

	_renderContent = () => {
		const { syncContent, progress } = this.state
		return (
			<SafeAreaView style={styles.codePushContainer}>
				<View style={styles.codePushContent}>
					<View style={styles.mainContent}>
						{this.state.buttons.map(this._renderButton)}
					</View>
					<ScrollView style={styles.showContent}>
						{progress && (
							<Text style={styles.messages}>
								{progress.receivedBytes} of {progress.totalBytes} bytes received
							</Text>
						)}
						{typeof syncContent === 'string' && (
							<Text style={styles.messages}>{syncContent || ''}</Text>
						)}
						{typeof syncContent !== 'string' && syncContent && <>{syncContent}</>}
					</ScrollView>
				</View>
				<TouchableOpacity style={styles.codePushCloseBtn} onPress={this._switchStatus}>
					<Text style={styles.codePushCloseBtnText}>关闭</Text>
				</TouchableOpacity>
			</SafeAreaView>
		)
	}

	render() {
		const { showCodePush } = this.state

		return (
			<View style={styles.containerWrapper}>
				<View style={styles.contentContainer}>
					{React.Children.map(this.props.children, (child) => child)}
				</View>
				{showCodePush && this._renderContent()}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	containerWrapper: {
		flex: 1,
		position: 'relative',
	},
	codePushContainer: {
		backgroundColor: 'gray',
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	codePushContent: {
		flex: 1,
		marginTop: 50,
	},
	codePushCloseBtn: {
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
	},
	codePushCloseBtnText: {
		fontSize: 16,
		color: 'black',
	},
	mainContent: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	messages: {
		fontSize: 13,
		lineHeight: 20,
		padding: 10,
		textAlign: 'center',
	},
	button: {
		textAlign: 'center',
		color: 'blue',
		borderRadius: 5,
		fontSize: 17,
		borderWidth: 1,
		margin: 5,
		padding: 5,
	},
	contentContainer: {
		flex: 1,
		backgroundColor: 'white',
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 15,
		marginTop: 15,
	},
	rowTitle: {
		width: 140,
	},
	rowContent: {
		flex: 1,
		marginLeft: 5,
	},
	showContent: {
		flex: 1,
	},
	selectorRow: {
		flexDirection: 'row',
		paddingHorizontal: 15,
		height: 44,
		alignItems: 'center',
		backgroundColor: 'white',
	},
	point: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: 'gray',
	},
	pointSelected: {
		backgroundColor: 'green',
	}
})

export default CodePush(codePushOptions)(CodePushStatusView)
