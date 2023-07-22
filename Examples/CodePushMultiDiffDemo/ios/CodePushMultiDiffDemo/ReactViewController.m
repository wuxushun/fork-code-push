//
//  ReactViewController.m
//  TestHotFix
//
//  Created by Xushun Wu on 2021/4/12.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "ReactViewController.h"
#import <React/RCTRootView.h>
#import <CodePush/CodePush.h>
#import <React/RCTBundleURLProvider.h>

@interface ReactViewController ()
@property (nonatomic, strong) UIView *rctView;
@property (nonatomic, readonly) RCTBridge *rctBridge;
@property (nonatomic, strong) NSString *url;
@property (nonatomic, strong) NSString *path;
@property (nonatomic, strong) NSString *name;
@end

@implementation ReactViewController

- (instancetype)initWithURL:(NSString *)url path:(NSString *)path moduleName:(NSString *) name{
  if (self = [super init]) {
    self.url = url;
    self.path = path;
    self.name = name;
  }
  return self;
}

- (void)viewDidLoad {
  [super viewDidLoad];
  [self initView];
}

-(void)initView{
    NSURL *jsCodeLocation;
//    #if DEBUG
//      jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:self.path fallbackResource:nil];
//    #else
//      jsCodeLocation = [CodePush bundleURLForResource:self.path];
//    #endif
  jsCodeLocation = [CodePush bundleURLForResource:self.path withExtension:@""];
  RCTRootView * view = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation moduleName:self.name initialProperties:nil launchOptions:nil];
  view.frame = self.view.bounds;
  view.backgroundColor = [UIColor whiteColor];
  [self setView:view];
}

@end
