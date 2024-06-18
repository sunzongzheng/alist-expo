import KSPlayer

#if os(iOS)
@objc(PlayerViewInstance)
public class PlayerViewInstance: NSObject {
    static weak var detailView: VideoView?
    @objc public static var supportedInterfaceOrientations: UIInterfaceOrientationMask {
      if (KSOptions.supportedInterfaceOrientations == .allButUpsideDown) {
        return .portrait
      } else if let playerView = detailView?.playerView, playerView.landscapeButton.isSelected {
        if (playerView.playerLayer!.isPipActive) {
          return .portrait
        } else if (playerView.isHorizonal()) {
          return .landscape
        } else {
          return .portrait
        }
      } else {
        return KSOptions.supportedInterfaceOrientations
      }
    }
}
#endif
