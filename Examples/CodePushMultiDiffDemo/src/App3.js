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
				ios: 'cR6RTRvd5URJ8F5KUMSYRXXwMoRg4ksvOXqog',
				android: 'Sb2AeSnFXrkA68slJTLjZsF0mvrW4ksvOXqog',
			},
			label: '环境1',
		},
		{
			deploymentKey: {
				ios: 'QirKGHY1eqV91t2GFCVpiT9d6Djb4ksvOXqog',
				android: 'QlEvxl4zymbaTTIQVFJPklFyAb7m4ksvOXqog',
			},
			label: '环境2',
		},
		{
			deploymentKey: {
				ios: '85iSl1jCOAcbXXIwnzyt5oB9dEjs4ksvOXqog',
				android: 'fWPuELWeqSOacuLOUYxmJhP0BG7k4ksvOXqog',
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
					bundleName={'module3'}
					envs={codePushEnvs}
				>
					<View style={styles.content}>
						<Text>环境：1</Text>
						<Text>模块：module3</Text>
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
