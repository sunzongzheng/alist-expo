import UIKit
import AVFoundation

class HCKeepBGRunManager {
    static let shared = HCKeepBGRunManager()

    let circularDuration: TimeInterval = 60
    var task: UIBackgroundTaskIdentifier = .invalid
    var playerBack: AVAudioPlayer?
    var timerAD: Timer?
    var timerLog: Timer?
    var count = 0

    private let queue = DispatchQueue(label: "com.audio.inBackground")

    private init() {
        setupAudioSession()
        // 静音文件
        if let filePath = Bundle.main.path(forResource: "jm", ofType: "mp3"),
           let fileURL = URL(string: filePath) {
            do {
                playerBack = try AVAudioPlayer(contentsOf: fileURL)
                playerBack?.prepareToPlay()
                playerBack?.volume = 0.01  // 0.0~1.0, 默认为1.0
                playerBack?.numberOfLoops = -1  // 循环播放
            } catch {
                print("AVAudioPlayer init failed: \(error)")
            }
        }
    }

    func setupAudioSession() {
        let audioSession = AVAudioSession.sharedInstance()
        do {
            // 设置后台播放
            try audioSession.setCategory(.playback, options: .mixWithOthers)
            try audioSession.setActive(true)
            print("\(audioSession.isOtherAudioPlaying)") // Testing if other audio is playing
        } catch {
            print("Error setting audio session category or activating it: \(error)")
        }
    }

    func startBGRun() {
        playerBack?.play()
        applyforBackgroundTask()

        queue.async {
            self.timerLog = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
                self.log()
            }
            self.timerAD = Timer.scheduledTimer(withTimeInterval: self.circularDuration, repeats: true) { _ in
                self.startAudioPlay()
            }

            RunLoop.current.add(self.timerAD!, forMode: .default)
            RunLoop.current.add(self.timerLog!, forMode: .default)
            RunLoop.current.run()
        }
    }

    func applyforBackgroundTask() {
        task = UIApplication.shared.beginBackgroundTask {
            DispatchQueue.main.async {
                UIApplication.shared.endBackgroundTask(self.task)
                self.task = .invalid
            }
        }
    }

    func log() {
        count += 1
        print("_count = \(count)")
    }

    func startAudioPlay() {
        count = 0
        DispatchQueue.main.async {
            if UIApplication.shared.backgroundTimeRemaining < 61.0 {
                print("后台快被杀死了")
                self.playerBack?.play()
                self.applyforBackgroundTask()
            } else {
                print("后台继续活跃呢")
            }
            self.playerBack?.stop()
        }
    }

    func stopBGRun() {
        if let timerAD = timerAD {
            timerLog?.invalidate()
            timerLog = nil
            
            timerAD.invalidate()
            self.timerAD = nil
            
            playerBack?.stop()
            
            if task != .invalid {
                UIApplication.shared.endBackgroundTask(task)
                task = .invalid
            }
        }
    }
}
