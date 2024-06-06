import Foundation
import UIKit
import KSPlayer

@objc(VideoPlayer)
class VideoPlayer: NSObject {
  
  @objc func play(_ src: String) {
    DispatchQueue.main.async {
      if let appDelegate = UIApplication.shared.delegate as? AppDelegate {
        let window = appDelegate.window
        
        if ((PlayerViewInstance.detailView) != nil) {
            PlayerViewInstance.detailView?.playerView.resetPlayer()
            PlayerViewInstance.detailView?.removeFromSuperview()
            PlayerViewInstance.detailView = nil
        }
        
        let resource = KSPlayerResource(url: URL(string: src)!)
        let controller = DetailView()
        controller.resource = resource
        controller.frame = window.bounds
        window.rootViewController?.view?.addSubview(controller)
      }
    }
  }
}
