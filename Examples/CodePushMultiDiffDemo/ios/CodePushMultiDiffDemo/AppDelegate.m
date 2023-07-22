#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "ReactViewController.h"

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate {
  UINavigationController *rootViewController;
  UIViewController *mainViewController;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  mainViewController = [UIViewController new];
  mainViewController.view = [[NSBundle mainBundle] loadNibNamed:@"MainScreen" owner:self options:nil].lastObject;
  rootViewController = [[UINavigationController alloc] initWithRootViewController:mainViewController];
  mainViewController.edgesForExtendedLayout = UIRectEdgeNone;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  UIButton* buz1 = [mainViewController.view viewWithTag:100];
  UIButton* buz2 = [mainViewController.view viewWithTag:101];
  UIButton* buz3 = [mainViewController.view viewWithTag:102];
  
  [buz1 addTarget:self action:@selector(goBuz1:) forControlEvents:UIControlEventTouchUpInside];
  [buz2 addTarget:self action:@selector(goBuz2:) forControlEvents:UIControlEventTouchUpInside];
  [buz3 addTarget:self action:@selector(goBuz3:) forControlEvents:UIControlEventTouchUpInside];
  

  return YES;
}

- (void)goBuz1:(UIButton *)button{
  UIViewController* controller = [[ReactViewController alloc] initWithURL:@"" path:@"module1" moduleName: @"module1"];
  [mainViewController.navigationController pushViewController:controller animated:YES];
}

- (void)goBuz2:(UIButton *)button{
  UIViewController* controller = [[ReactViewController alloc] initWithURL:@"" path:@"module2" moduleName: @"module2"];
  [mainViewController.navigationController pushViewController:controller animated:YES];
}

- (void)goBuz3:(UIButton *)button{
  UIViewController* controller = [[ReactViewController alloc] initWithURL:@"" path:@"module3" moduleName: @"module3"];
  [mainViewController.navigationController pushViewController:controller animated:YES];
}

@end
