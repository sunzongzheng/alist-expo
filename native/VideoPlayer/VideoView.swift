import CoreServices
import KSPlayer
import UIKit

#if os(iOS)
class VideoView: UIView, PlayerControllerDelegate {
    let playerView = IOSView()

    init() {
        super.init(frame: CGRect(x: 0, y: 0, width: 200, height: 200))
      
        KSOptions.canBackgroundPlay = true
        KSOptions.logLevel = .debug
        KSOptions.secondPlayerType = KSMEPlayer.self
        KSOptions.supportedInterfaceOrientations = .portrait
        KSOptions.isPipPopViewController = true
      
        self.addSubview(playerView)
        playerView.translatesAutoresizingMaskIntoConstraints = false
        playerView.backBlock = { [weak self] in
            guard let self = self else { return }
            self.playerView.resetPlayer()
            self.removeFromSuperview()
            PlayerViewInstance.detailView = nil
        }
        playerView.fullscreenCallback = { [weak self] isFullScreen in
            guard let self = self else { return }
            if (isFullScreen) {
              self.frame = CGRect(x: -1000, y: -1000, width: self.frame.width, height: self.frame.height)
            } else {
              self.playerView.resetPlayer()
              self.removeFromSuperview()
              PlayerViewInstance.detailView = nil
            }
        }
        playerView.becomeFirstResponder()
        playerView.delegate = self
        playerView.toolBar.playButton.isSelected = true
        playerView.replayButton.isHidden = true
        playerView.loadingIndector.isHidden = false
        playerView.loadingIndector.startAnimating()
        PlayerViewInstance.detailView = self
      
        NSLayoutConstraint.activate([
            playerView.topAnchor.constraint(equalTo: self.readableContentGuide.topAnchor),
            playerView.leadingAnchor.constraint(equalTo: self.leadingAnchor),
            playerView.trailingAnchor.constraint(equalTo: self.trailingAnchor),
            playerView.bottomAnchor.constraint(equalTo: self.bottomAnchor),
        ])
    }
  
    func playerController(state: KSPlayer.KSPlayerState) {
    }
    
    func playerController(currentTime: TimeInterval, totalTime: TimeInterval) {
    }
    
    func playerController(finish error: Error?) {
    }
    
    func playerController(maskShow: Bool) {
    }
    
    func playerController(action: KSPlayer.PlayerButtonType) {
    }
    
    func playerController(bufferedCount: Int, consumeTime: TimeInterval) {
      self.playerView.updateUI(isFullScreen: true)
      self.playerView.play()
    }
  
    func playerController(seek: TimeInterval) {
    }
  
    required init?(coder: NSCoder) {
      fatalError("init(coder:) has not been implemented")
    }
}
#endif
