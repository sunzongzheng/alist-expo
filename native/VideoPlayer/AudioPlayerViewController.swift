class AudioPlayerViewController: VideoPlayerViewController {
  override func viewDidLoad() {
    super.viewDidLoad()
    
    let imageView = UIImageView(image: UIImage(named: "audio"))
    imageView.contentMode = .scaleAspectFit
    imageView.translatesAutoresizingMaskIntoConstraints = false
    self.view.addSubview(imageView)
    NSLayoutConstraint.activate([
        imageView.centerXAnchor.constraint(equalTo: self.view.centerXAnchor), // 水平居中
        imageView.centerYAnchor.constraint(equalTo: self.view.centerYAnchor), // 垂直居中
        imageView.widthAnchor.constraint(equalToConstant: 200), // 图片宽度
        imageView.heightAnchor.constraint(equalToConstant: 200) // 图片高度
    ])
  }
}
