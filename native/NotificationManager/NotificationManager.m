#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(NotificationManager, NSObject)

RCT_EXTERN_METHOD(requestAuthorization)
RCT_EXTERN_METHOD(scheduleNotification:(NSString)title body:(NSString)body)
RCT_EXTERN_METHOD(removeNotification)

@end
