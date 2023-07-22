import React from 'react';
import {
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	View,
	useColorScheme,
	Button,
	Dimensions,
	Platform,
} from 'react-native';
import CodePushStatusView, {CodePushOpenDebugEvent, getVersion} from "./CodePushStatusView";

const App1 = () => {
	const [version, setVersion] = React.useState('0');
	const isDarkMode = useColorScheme() === 'dark';

	React.useEffect(() => {
		getVersion().then((result) => setVersion(result));
	}, [])

	const backgroundStyle = {
		backgroundColor: isDarkMode ? 'black' : 'white',
	};

	const codePushEnvs = [
		{
			deploymentKey: {
				ios: 'UPctY12zusNoxrdPUUjoqLs7MOzA4ksvOXqog',
				android: 'ErAObKEwkzoJdtrmm3OnFeTXweUd4ksvOXqog',
			},
			label: '环境1',
		},
		{
			deploymentKey: {
				ios: 'sgLQ838H46MiAql2k4pCfNW2R89B4ksvOXqog',
				android: 'fwGcd5euvFN74YnIJzxn26ME1d2R4ksvOXqog',
			},
			label: '环境2',
		},
		{
			deploymentKey: {
				ios: '3cewGtsTpooN5LGVk28c0jwzfd4L4ksvOXqog',
				android: '6oJBUGMHUjcrWyIPOdqyfS36hMd94ksvOXqog',
			},
			label: '环境3',
		}
	].map(sub => ({ ...sub, deploymentKey: sub.deploymentKey[Platform.OS] }))

	const _onJump =  () => {
		CodePushOpenDebugEvent()
	}

	return (
		<SafeAreaView style={backgroundStyle}>
			<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
			<View style={styles.container}>
				<CodePushStatusView
					bundleName={'module2'}
					envs={codePushEnvs}
				>
					<View style={styles.content}>
						<Text>环境：1</Text>
						<Text>模块：module2</Text>
						<Text>版本：{version}-{1}</Text>
						<Button onPress={_onJump} title={'跳转热更新'} />
					</View>
				</CodePushStatusView>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height - 150,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default App1;
