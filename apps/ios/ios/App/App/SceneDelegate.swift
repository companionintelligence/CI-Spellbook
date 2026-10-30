import UIKit
import Capacitor

// The iOS 26+ SDKs (Xcode 26 and later) require the UIScene life cycle: an app built
// with them and declaring no UIApplicationSceneManifest is refused at launch with
// "UIScene life cycle is required for apps built with this SDK". Capacitor 7's template
// still creates the window in AppDelegate, so this delegate does it instead, from the
// Main storyboard (whose initial view controller is Capacitor's CAPBridgeViewController).
//
// Adopting scenes silently retires the UIApplicationDelegate URL callbacks
// (`application(_:open:options:)`, `application(_:continue:restorationHandler:)`), and
// Capacitor has no scene support of its own, so the scene equivalents below hand URLs
// to ApplicationDelegateProxy. Spellbook registers no URL scheme and no Universal Link
// today, so nothing reaches them yet; they keep @capacitor/app's appUrlOpen working the
// day one is added instead of failing without a sound.
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = scene as? UIWindowScene else { return }

        let window = UIWindow(windowScene: windowScene)
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        window.rootViewController = storyboard.instantiateInitialViewController()
        self.window = window
        window.makeKeyAndVisible()

        // A cold launch caused by a URL delivers it here, not to scene(_:openURLContexts:).
        if let urlContext = connectionOptions.urlContexts.first {
            handle(urlContext)
        }
        for activity in connectionOptions.userActivities
        where activity.activityType == NSUserActivityTypeBrowsingWeb {
            handle(activity)
        }
    }

    /// Warm deep link: the app was already running.
    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        guard let urlContext = URLContexts.first else { return }
        handle(urlContext)
    }

    /// Universal Links.
    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        handle(userActivity)
    }

    // MARK: - Forwarding

    private func handle(_ urlContext: UIOpenURLContext) {
        var options: [UIApplication.OpenURLOptionsKey: Any] = [:]
        if let sourceApplication = urlContext.options.sourceApplication {
            options[.sourceApplication] = sourceApplication
        }
        if let annotation = urlContext.options.annotation {
            options[.annotation] = annotation
        }
        _ = ApplicationDelegateProxy.shared.application(
            UIApplication.shared,
            open: urlContext.url,
            options: options
        )
    }

    private func handle(_ userActivity: NSUserActivity) {
        _ = ApplicationDelegateProxy.shared.application(
            UIApplication.shared,
            continue: userActivity,
            restorationHandler: { _ in }
        )
    }
}
