// GoLibraryBridge.swift
import Foundation
import React
import Alistlib // 导入Go库

class EventListener: NSObject, AlistlibEventProtocol {
    func onProcessExit(_ code: Int) {
        // Handle process exit logic here
        print("Process exited with code \(code).")
    }

    func onShutdown(_ t: String?) {
        // Handle shutdown logic here
        print("Shutdown initiated: \(t ?? "No additional information")")
    }

    func onStartError(_ t: String?, err: String?) {
        // Handle start error logic here
        print("Start error: \(err ?? "Unknown Error")")
    }
}

class LogCallbackHandler: NSObject, AlistlibLogCallbackProtocol {
    private var onLogCallback: RCTResponseSenderBlock? // 用于存储JavaScript的回调函数

    init(onLog: @escaping RCTResponseSenderBlock) {
        self.onLogCallback = onLog
    }

    func onLog(_ level: Int16, time: Int64, message: String?) {
        // 使用存储的JavaScript回调函数发送日志
        self.onLogCallback?([["level": level, "time": time, "message": message ?? ""]])
      // Handle log callback logic here
      print("Log message at level \(level): \(message ?? "No message")")
    }
}

@objc(Alist)
class Alist: RCTEventEmitter {

  @objc func `init`(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {

    let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
    let documentsDirectory = paths[0]
    let fileURL = documentsDirectory.appendingPathComponent("alist")

    let eventListener = EventListener()

    // 创建LogCallbackHandler时，传递JS回调
    let logCallbackHandler = LogCallbackHandler(onLog: { [weak self] (logInfo) in
      self?.sendEvent(withName: "onLog", body: logInfo?[0])
    })

    // 初始化 NSError 的指针
    var error: NSError?
    AlistlibSetConfigData(fileURL.path)
    AlistlibSetConfigLogStd(true)
    AlistlibInit(eventListener, logCallbackHandler, &error)
    if (error == nil) {
      resolve("ok")
    } else {
      reject("server start", "服务启动失败", error)
    }
  }

  @objc func start(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    AlistlibStart()
    resolve("ok")
  }

  @objc func stop(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    var error: NSError?
    AlistlibShutdown(0, &error)

    if (error == nil) {
      resolve("ok")
    } else {
      reject("server stop", "服务停止失败", error)
    }
  }

  @objc func isRunning(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(AlistlibIsRunning("http"))
  }

  @objc func getAdminPassword(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(AlistlibGetAdminPassword())
  }

  @objc func getOutboundIPString(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(AlistlibGetOutboundIPString())
  }

  @objc func setAdminPassword(_ password: String, resolver resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    AlistlibSetAdminPassword(password)
    resolve("ok")
  }

  // React Native桥接需要的因素
  @objc override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func supportedEvents() -> [String]! {
      return ["onLog"]
  }
}
