import CoreServices
import KSPlayer
import UIKit

class AudioView: VideoView {

    override init() {
        super.init()
      
        KSOptions.canBackgroundPlay = true
        KSOptions.logLevel = .debug
        KSOptions.secondPlayerType = KSMEPlayer.self
        KSOptions.supportedInterfaceOrientations = .portrait
      
        self.addSubview(playerView)
        playerView.translatesAutoresizingMaskIntoConstraints = false
        playerView.landscapeButton.isHidden = true
        playerView.toolBar.pipButton.isHidden = true
        playerView.backBlock = { [weak self] in
            guard let self = self else { return }
            self.playerView.resetPlayer()
            self.removeFromSuperview()
            PlayerViewInstance.detailView = nil
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
      
        let imageView = UIImageView(image: UIImage(named: "audio"))
        imageView.contentMode = .scaleAspectFit
        imageView.translatesAutoresizingMaskIntoConstraints = false
        self.addSubview(imageView)
        NSLayoutConstraint.activate([
            imageView.centerXAnchor.constraint(equalTo: self.centerXAnchor), // 水平居中
            imageView.centerYAnchor.constraint(equalTo: self.centerYAnchor), // 垂直居中
            imageView.widthAnchor.constraint(equalToConstant: 200), // 图片宽度
            imageView.heightAnchor.constraint(equalToConstant: 200) // 图片高度
        ])
    }
    
    override func playerController(bufferedCount: Int, consumeTime: TimeInterval) {
      self.playerView.play()
    }
  
    required init?(coder: NSCoder) {
      fatalError("init(coder:) has not been implemented")
    }
}
