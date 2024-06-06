import UIKit
import React
import Expo

@UIApplicationMain
class AppDelegate: EXAppDelegateWrapper {
    var backgroundManager: HCKeepBGRunManager?
  
    override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        self.moduleName = "main"
        self.initialProps = [String: Any]();
      
        backgroundManager = HCKeepBGRunManager.shared
        NotificationCenter.default.addObserver(self, selector: #selector(handleApplicationDidEnterBackground), name: UIApplication.didEnterBackgroundNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handleApplicationWillEnterForeground), name: UIApplication.willEnterForegroundNotification, object: nil)
      
        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }

    override func sourceURL(for bridge: RCTBridge!) -> URL! {
        return self.bundleURL()
    }

    override func bundleURL() -> URL {
        #if DEBUG
        return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry", fallbackExtension: nil)!
        #else
        return Bundle.main.url(forResource: "main", withExtension: "jsbundle")!
        #endif
    }

    override func application(_ application: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        return super.application(application, open: url, options: options) || RCTLinkingManager.application(application, open: url, options: options)
    }

    override func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        let result = RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
        return super.application(application, continue: userActivity, restorationHandler: restorationHandler) || result
    }

    override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        super.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
    }

    override func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        super.application(application, didFailToRegisterForRemoteNotificationsWithError: error)
    }

    override func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        super.application(application, didReceiveRemoteNotification: userInfo, fetchCompletionHandler: completionHandler)
    }

    override func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
        return PlayerViewInstance.supportedInterfaceOrientations
    }
  
    @objc private func handleApplicationDidEnterBackground() {
        if (PlayerViewInstance.detailView?.playerView == nil) {
          backgroundManager?.startBGRun()
        }
    }

    @objc private func handleApplicationWillEnterForeground() {
        backgroundManager?.stopBGRun()
    }
    
    override func applicationWillTerminate(_ application: UIApplication) {
        NotificationCenter.default.removeObserver(self)
    }
}
