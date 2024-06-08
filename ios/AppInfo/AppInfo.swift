import Foundation
import React

@objc(AppInfo)
class AppInfo: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc
  func getAppVersion(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    if let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String {
      resolve(version)
    } else {
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("no_version", "No version found", error)
    }
  }
}
