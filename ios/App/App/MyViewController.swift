import UIKit
import Capacitor

@objc(MyViewController)
class MyViewController: CAPBridgeViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Désactiver le bounce/rubber-band effect de la WebView
        webView?.scrollView.bounces = false
        webView?.scrollView.alwaysBounceVertical = false
        webView?.scrollView.alwaysBounceHorizontal = false

        // Couleur de fond de la WebView (évite le gris)
        webView?.scrollView.backgroundColor = UIColor(red: 0.102, green: 0.098, blue: 0.098, alpha: 1.0) // #1A1919
        webView?.backgroundColor = UIColor(red: 0.102, green: 0.098, blue: 0.098, alpha: 1.0)

        // Désactiver l'overscroll indicator
        webView?.scrollView.showsVerticalScrollIndicator = false
        webView?.scrollView.showsHorizontalScrollIndicator = false
    }
}
