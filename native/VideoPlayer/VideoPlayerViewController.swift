import CoreServices
import KSPlayer
import UIKit

protocol VideoPlayerProtocol: UIViewController {
    var resource: KSPlayerResource? { get set }
}

class VideoPlayerViewController: UIViewController, VideoPlayerProtocol {
    private let playerView = TVOSPlayerView()
    var resource: KSPlayerResource? {
        didSet {
            if let resource {
                playerView.set(resource: resource)
            }
        }
    }
  
    init() {
      super.init(nibName: nil, bundle: nil)
      KSOptions.canBackgroundPlay = true
      KSOptions.logLevel = .debug
      KSOptions.secondPlayerType = KSMEPlayer.self
      KSOptions.isAutoPlay = true
    }
  
    required init?(coder: NSCoder) {
      fatalError("init(coder:) has not been implemented")
    }
  
    override func viewDidLoad() {
        super.viewDidLoad()
        view.addSubview(playerView)
        playerView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            playerView.topAnchor.constraint(equalTo: view.topAnchor),
            playerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            playerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            playerView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])
        view.layoutIfNeeded()
        playerView.becomeFirstResponder()
        playerView.backgroundColor = .black
        playerView.delegate = self
        playerView.toolBar.playButton.isSelected = true
        playerView.replayButton.isHidden = true
        playerView.loadingIndector.isHidden = false
        playerView.loadingIndector.startAnimating()
        playerView.toolBar.pipButton.isHidden = true
      
        // 遥控器事件
        // play/puase
        let playPauseRecognizer = UITapGestureRecognizer(target: self, action: #selector(playPause))
        playPauseRecognizer.allowedPressTypes = [NSNumber(value:UIPress.PressType.playPause.rawValue)]
        self.view.addGestureRecognizer(playPauseRecognizer)
        // 返回/menu
        let menuRecognizer = UITapGestureRecognizer(target: self, action: #selector(menu))
        menuRecognizer.allowedPressTypes = [NSNumber(value:UIPress.PressType.menu.rawValue)]
        self.view.addGestureRecognizer(menuRecognizer)
        // right
        let rightRecognizer = UITapGestureRecognizer(target: self, action: #selector(right))
        rightRecognizer.allowedPressTypes = [NSNumber(value:UIPress.PressType.rightArrow.rawValue)]
        self.view.addGestureRecognizer(rightRecognizer)
        // left
        let leftRecognizer = UITapGestureRecognizer(target: self, action: #selector(left))
        leftRecognizer.allowedPressTypes = [NSNumber(value:UIPress.PressType.leftArrow.rawValue)]
        self.view.addGestureRecognizer(leftRecognizer)
        // select
        let selectRecognizer = UITapGestureRecognizer(target: self, action: #selector(select2))
        selectRecognizer.allowedPressTypes = [NSNumber(value:UIPress.PressType.select.rawValue)]
        self.view.addGestureRecognizer(selectRecognizer)
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        navigationController?.setNavigationBarHidden(false, animated: true)
    }
  
    @objc func playPause() {
      if (playerView.toolBar.playButton.isSelected) {
        playerView.pause()
        playerView.isMaskShow = true
      } else {
        playerView.play()
        playerView.isMaskShow = false
      }
    }
  
    @objc func menu() {
      if self.presentedViewController is UIAlertController {
      } else if (playerView.isMaskShow) {
        playerView.isMaskShow = false
      } else {
        self.dismiss(animated: true)
      }
    }

    @objc func right() {
      if (!playerView.isMaskShow) {
        let newTime = playerView.toolBar.currentTime + 10
        playerView.seek(time: newTime) { _ in }
      }
    }

    @objc func left() {
      if (!playerView.isMaskShow) {
        let newTime = playerView.toolBar.currentTime - 10
        playerView.seek(time: newTime) { _ in }
      }
    }

    @objc func select2() {
      playerView.isMaskShow = true
    }
}

extension VideoPlayerViewController: PlayerControllerDelegate {
    func playerController(seek _: TimeInterval) {}

    func playerController(state _: KSPlayerState) {}

    func playerController(currentTime _: TimeInterval, totalTime _: TimeInterval) {}

    func playerController(finish _: Error?) {}

    func playerController(maskShow _: Bool) {
    }

    func playerController(action _: PlayerButtonType) {}

    func playerController(bufferedCount _: Int, consumeTime _: TimeInterval) {}
}
