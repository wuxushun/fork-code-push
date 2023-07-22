//
//  ReactViewController.h
//  TestHotFix
//
//  Created by Xushun Wu on 2021/4/12.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface ReactViewController : UIViewController

- (instancetype)initWithURL:(NSString *)url path:(NSString *)path moduleName:(NSString *) name;

@end

NS_ASSUME_NONNULL_END
