use tauri::{
    AppHandle, Manager, WebviewUrl, WebviewWindowBuilder,
    tray::{TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState},
    menu::{Menu, MenuItem},
};
use tauri_plugin_autostart::MacosLauncher;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Set the main window always on top
#[tauri::command]
async fn set_always_on_top(app: AppHandle, always_on_top: bool) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        window.set_always_on_top(always_on_top)
            .map_err(|e| e.to_string())?;
        println!("Always on top set to: {}", always_on_top);
    }
    Ok(())
}

/// Show popup notification window
#[tauri::command]
async fn show_popup_window(app: AppHandle) -> Result<(), String> {
    // Check if popup already exists
    if app.get_webview_window("popup").is_some() {
        // Just focus existing popup
        if let Some(popup) = app.get_webview_window("popup") {
            let _ = popup.set_always_on_top(true);
            let _ = popup.unminimize();
            let _ = popup.show();
            let _ = popup.set_focus();
        }
        return Ok(());
    }

    // Create new popup window
    let popup = WebviewWindowBuilder::new(
        &app,
        "popup",
        WebviewUrl::App("index.html?popup=true".into())
    )
    .title("Mola Zamanı!")
    .inner_size(380.0, 420.0)
    .resizable(false)
    .decorations(false)
    .always_on_top(true)
    .center()
    .focused(true)
    .skip_taskbar(false)
    .build()
    .map_err(|e| e.to_string())?;
    
    // Make sure it's visible and on top
    let _ = popup.show();
    let _ = popup.set_focus();
    
    println!("Popup window created");
    Ok(())
}

/// Close popup window
#[tauri::command]
async fn close_popup_window(app: AppHandle) -> Result<(), String> {
    if let Some(popup) = app.get_webview_window("popup") {
        popup.close().map_err(|e| e.to_string())?;
        println!("Popup window closed");
    }
    Ok(())
}

/// Request user attention (flash taskbar)
#[tauri::command]
async fn request_attention(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        window.request_user_attention(Some(tauri::UserAttentionType::Critical))
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Play system notification sound using Windows API
#[tauri::command]
fn play_notification_sound() {
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        // Use PowerShell to play system sound
        let _ = Command::new("powershell")
            .args(["-Command", "[System.Media.SystemSounds]::Exclamation.Play()"])
            .spawn();
    }
    println!("Notification sound played");
}

/// Enable or disable autostart
#[tauri::command]
async fn set_autostart(app: AppHandle, enabled: bool) -> Result<(), String> {
    use tauri_plugin_autostart::ManagerExt;
    
    let autostart_manager = app.autolaunch();
    
    if enabled {
        autostart_manager.enable().map_err(|e| e.to_string())?;
        println!("Autostart enabled");
    } else {
        autostart_manager.disable().map_err(|e| e.to_string())?;
        println!("Autostart disabled");
    }
    
    Ok(())
}

/// Check if autostart is enabled
#[tauri::command]
async fn is_autostart_enabled(app: AppHandle) -> Result<bool, String> {
    use tauri_plugin_autostart::ManagerExt;
    
    let autostart_manager = app.autolaunch();
    autostart_manager.is_enabled().map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Check if app was started with --minimized argument (autostart)
    let args: Vec<String> = std::env::args().collect();
    let start_minimized = args.iter().any(|arg| arg == "--minimized");
    
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--minimized"]) // Pass --minimized flag on autostart
        ))
        .invoke_handler(tauri::generate_handler![
            greet,
            set_always_on_top,
            show_popup_window,
            close_popup_window,
            request_attention,
            play_notification_sound,
            set_autostart,
            is_autostart_enabled
        ])
        .setup(move |app| {
            // Create tray menu
            let show_item = MenuItem::with_id(app, "show", "Göster", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "Çıkış", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_item, &quit_item])?;
            
            // Build system tray
            let _tray = TrayIconBuilder::with_id("main-tray")
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| {
                    match event.id.as_ref() {
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                            }
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    // Left click on tray icon shows the window
                    if let TrayIconEvent::Click { button: MouseButton::Left, button_state: MouseButtonState::Up, .. } = event {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.unminimize();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            // Handle main window
            if let Some(window) = app.get_webview_window("main") {
                let window_clone = window.clone();
                
                // If started with --minimized flag (autostart), hide window immediately
                if start_minimized {
                    let _ = window.hide();
                    println!("Started minimized to tray (autostart)");
                } else {
                    println!("Main window initialized");
                }
                
                // Hide to tray on close request
                window.on_window_event(move |event| {
                    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                        // Prevent close, hide to tray instead
                        api.prevent_close();
                        let _ = window_clone.hide();
                        println!("Window hidden to tray");
                    }
                });
            }
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
