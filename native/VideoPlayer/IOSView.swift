import Foundation
import KSPlayer
import AVKit

#if os(iOS)
class IOSView: IOSVideoPlayerView {
  public var fullscreenCallback: ((_ isFullScreen: Bool) -> Void)?
  override func updateUI(isFullScreen: Bool) {
      super.updateUI(isFullScreen: isFullScreen)
      self.fullscreenCallback!(isFullScreen)
  }
}
#endif
