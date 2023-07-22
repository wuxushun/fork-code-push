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
	Image,
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
				ios: '7Jndia2mgE41JSBUXoz1LqEyGQZC4ksvOXqog',
				android: 'aNr6H2gRQMfMtHwxuKmSrcUg78IE4ksvOXqog',
			},
			label: '环境1',
		},
		{
			deploymentKey: {
				ios: 'QirKGHY1eqV91t2GFCVpiT9d6Djb4ksvOXqog',
				android: 'TNeMuqJbRkFVpORVXZnZnccoRsbV4ksvOXqog',
			},
			label: '环境2',
		},
		{
			deploymentKey: {
				ios: '85iSl1jCOAcbXXIwnzyt5oB9dEjs4ksvOXqog',
				android: 'cbJyTvFeO6oOOTsPTA3rq6GmyFSb4ksvOXqog',
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
					bundleName={'module1'}
					envs={codePushEnvs}
				>
					<View style={styles.content}>
						<Text>环境：1</Text>
						<Text>模块：module1</Text>
						<Text>模块：module1</Text>
						<Text>模块：module1</Text>
						<Text>模块：module1</Text>
						<Text>模块：module1</Text>
						<Text>模块：module1</Text>
						<Text>模块：module1</Text>
						<Text>模块：module1</Text>
						<Text>模块：module1</Text>
						<Text>版本：{version}-{50}</Text>
						<Button onPress={_onJump} title={'跳转热更新'} />
						<Image style={{ width: 150, height: 150 }} source={{ uri: 'https://img2.baidu.com/it/u=1514002029,2035215441&fm=26&fmt=auto' }}/>
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
