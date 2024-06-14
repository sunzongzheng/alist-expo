import Foundation
import UIKit
import KSPlayer

@objc(AudioPlayer)
class AudioPlayer: NSObject {
  
  @objc func play(_ src: String, header: [String: String]) {
    DispatchQueue.main.async {
      if let appDelegate = UIApplication.shared.delegate as? AppDelegate {
        let window = appDelegate.window
        
        if ((PlayerViewInstance.detailView) != nil) {
            PlayerViewInstance.detailView?.playerView.resetPlayer()
            PlayerViewInstance.detailView?.removeFromSuperview()
            PlayerViewInstance.detailView = nil
        }
        
        let options = KSOptions()
        if !header.isEmpty {
          options.appendHeader(header)
        }
        let controller = AudioView()
        controller.playerView.set(url: URL(string: src)!, options: options)
        controller.frame = window.bounds
        window.rootViewController?.view?.addSubview(controller)
      }
    }
  }
}
