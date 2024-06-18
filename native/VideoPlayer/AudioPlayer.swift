import Foundation
import UIKit
import KSPlayer

@objc(AudioPlayer)
class AudioPlayer: NSObject {
  
  @objc func play(_ src: String, header: [String: String]) {
    DispatchQueue.main.async {
      if let appDelegate = UIApplication.shared.delegate as? AppDelegate {
        let window = appDelegate.window
        
        let options = KSOptions()
        if !header.isEmpty {
          options.appendHeader(header)
          if ((header["User-Agent"]) != nil) {
            options.userAgent = header["User-Agent"]
          }
        }
        let resource = KSPlayerResource(url: URL(string: src)!, options: options)
        let controller = AudioPlayerViewController()
        controller.resource = resource
        window.rootViewController?.present(controller, animated: true)
      }
    }
  }
}
