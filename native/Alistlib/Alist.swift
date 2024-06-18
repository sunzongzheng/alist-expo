// GoLibraryBridge.swift
import Foundation
import React
import Alistlib // 导入Go库

class EventListener: NSObject, AlistlibEventProtocol {
    private var onProcessExitCallack: RCTResponseSenderBlock?
    private var onShutdownCallback: RCTResponseSenderBlock?
    private var onStartErrorCallback: RCTResponseSenderBlock?

    init(onProcessExit: @escaping RCTResponseSenderBlock, onShutdown: @escaping RCTResponseSenderBlock, onStartError: @escaping RCTResponseSenderBlock) {
        self.onProcessExitCallack = onProcessExit
        self.onShutdownCallback = onShutdown
        self.onStartErrorCallback = onStartError
    }
  
    func onProcessExit(_ code: Int) {
        self.onProcessExitCallack?([["code": code]])
        print("Process exited with code \(code).")
    }

    func onShutdown(_ t: String?) {
        self.onShutdownCallback?([["t": t]])
        print("Shutdown initiated: \(t ?? "No additional information")")
    }

    func onStartError(_ t: String?, err: String?) {
        self.onStartErrorCallback?([["t": t, "err": err]])
        print("Start error: \(err ?? "Unknown Error")")
    }
}

class LogCallbackHandler: NSObject, AlistlibLogCallbackProtocol {
    private var onLogCallback: RCTResponseSenderBlock? // 用于存储JavaScript的回调函数

    init(onLog: @escaping RCTResponseSenderBlock) {
        self.onLogCallback = onLog
    }

    func onLog(_ level: Int16, time: Int64, message: String?) {
        self.onLogCallback?([["level": level, "time": time, "message": message ?? ""]])
        print("Log message at level \(level): \(message ?? "No message")")
    }
}

@objc(Alist)
class Alist: RCTEventEmitter {

  @objc func `init`(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {

    #if os(tvOS)
    let documentsDirectory = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first!
    #else
    let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    #endif

    let eventListener = EventListener(
      onProcessExit: { [weak self] (body) in
        self?.sendEvent(withName: "onProcessExit", body: body?[0])
      },
      onShutdown: { [weak self] (body) in
        self?.sendEvent(withName: "onShutdown", body: body?[0])
      },
      onStartError: { [weak self] (body) in
        self?.sendEvent(withName: "onStartError", body: body?[0])
      }
    )

    let logCallbackHandler = LogCallbackHandler(onLog: { [weak self] (logInfo) in
      self?.sendEvent(withName: "onLog", body: logInfo?[0])
    })

    // 初始化 NSError 的指针
    var error: NSError?
    AlistlibSetConfigData(documentsDirectory.path)
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

  @objc func getAdminUsername(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(AlistlibGetAdminUsername())
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
      return ["onLog", "onProcessExit", "onShutdown", "onStartError"]
  }
}
