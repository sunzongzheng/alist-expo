#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AppInfo, NSObject)
RCT_EXTERN_METHOD(getAppVersion:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
