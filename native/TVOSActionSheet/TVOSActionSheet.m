// TVOSActionSheetBridge.m

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TVOSActionSheet, NSObject)

RCT_EXTERN_METHOD(showActionSheetWithOptions:(NSDictionary *)options
                  successCallback:(RCTResponseSenderBlock)successCallback)

@end
