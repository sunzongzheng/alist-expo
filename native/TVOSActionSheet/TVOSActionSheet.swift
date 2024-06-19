import Foundation
import UIKit

@objc(TVOSActionSheet)
class TVOSActionSheet: NSObject {

  @objc(showActionSheetWithOptions:successCallback:)
  func showActionSheetWithOptions(options: NSDictionary, successCallback: @escaping RCTResponseSenderBlock) -> Void {
    
    let actionOptions = options["options"] as? [String] ?? []
    
    let alertController = UIAlertController(title: nil, message: nil, preferredStyle: .alert)

    let activeIndex = options["activeIndex"] as? Int ?? -1
    for (index, option) in actionOptions.enumerated() {
      let action = UIAlertAction(title: option, style: .default) { _ in
        successCallback([index])
      }
      alertController.addAction(action)
      if index == activeIndex {
          alertController.preferredAction = action
          action.setValue(true, forKey: "checked")
      }
    }

    let cancelAction = UIAlertAction(title: "取消", style: .cancel)
    alertController.addAction(cancelAction)

    DispatchQueue.main.async {
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene, let window = windowScene.windows.first, let topController = window.rootViewController {
            topController.present(alertController, animated: true, completion: nil)
        }
    }

  }
}
