#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(VideoPlayer, RCTViewManager)

RCT_EXTERN_METHOD(play:(nonnull NSString *)src header:(NSDictionary *)header)

@end
