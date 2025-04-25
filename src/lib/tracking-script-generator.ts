import { getChannel, getBot, getIntegration } from "@/lib/supabase"

interface TrackingScriptOptions {
  includePixel?: boolean
  includeLeadTracking?: boolean
  includeClickTracking?: boolean
  pixelId?: string
  apiKey?: string
  botUsername?: string
  channelUsername?: string
  defaultInviteLink?: string
  redirectDelay?: number
  trackingEndpoint?: string
}

/**
 * Generates a tracking script for a channel
 */
export async function generateTrackingScript(channelId: string, options: TrackingScriptOptions = {}) {
  try {
    // Get channel info
    const channel = await getChannel(channelId)

    if (!channel) {
      throw new Error(`Channel with ID ${channelId} not found`)
    }

    if (!channel.tracking_enabled) {
      throw new Error(`Tracking is not enabled for channel ${channelId}`)
    }

    // Get bot info
    const bot = await getBot(channel.bot_id)

    if (!bot) {
      throw new Error(`Bot with ID ${channel.bot_id} not found`)
    }

    // Get Facebook Pixel integration if needed
    let fbPixelIntegration = null
    if (options.includePixel) {
      const integration = await getIntegration(channelId, "facebook_pixel")
      if (integration?.success && integration.enabled) {
        fbPixelIntegration = integration
      }
    }

    // Generate API key if not provided
    const apiKey = options.apiKey || generateApiKey(channelId)

    // Generate tracking script
    const script = generateScript({
      ...options,
      apiKey,
      channelId,
      botUsername: options.botUsername || bot.username,
      channelUsername: options.channelUsername || channel.username,
      pixelId: options.pixelId || fbPixelIntegration?.config?.pixel_id,
      defaultInviteLink: options.defaultInviteLink || `https://t.me/${channel.username.replace("@", "")}`,
      trackingEndpoint:
        options.trackingEndpoint || `${process.env.NEXT_PUBLIC_APP_URL || "https://teletracker.app"}/api/tracking`,
    })

    return { success: true, script, apiKey }
  } catch (error) {
    console.error(`Error generating tracking script for channel ${channelId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Generates a unique API key for a channel
 */
function generateApiKey(channelId: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const segments = [
    generateRandomString(4, chars),
    generateRandomString(4, chars),
    generateRandomString(4, chars),
    generateRandomString(4, chars),
    channelId.substring(0, 8),
  ]

  return segments.join("-")
}

/**
 * Generates a random string
 */
function generateRandomString(length: number, chars: string): string {
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generates the actual tracking script
 */
function generateScript(options: Required<TrackingScriptOptions> & { channelId: string }): string {
  // Base script with lead tracking
  let script = `
// TeleTracker Tracking Script v1.0
// Generated for channel: ${options.channelUsername}
// API Key: ${options.apiKey}

(function() {
  // Configuration
  const config = {
    apiKey: "${options.apiKey}",
    channelId: "${options.channelId}",
    trackingEndpoint: "${options.trackingEndpoint}",
    defaultInviteLink: "${options.defaultInviteLink}",
    redirectDelay: ${options.redirectDelay || 5}
  };

  // Helper function to get cookies
  function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // Helper function to set cookies
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
  }

  // Generate a unique lead ID if not exists
  function getLeadId() {
    let leadId = getCookie("tt_lead_id");
    if (!leadId) {
      leadId = "lead_" + Math.random().toString(36).substring(2, 15);
      setCookie("tt_lead_id", leadId, 365);
    }
    return leadId;
  }

  // Track an event
  function trackEvent(eventType, eventData = {}) {
    const leadId = getLeadId();
    const data = {
      event: eventType,
      lead_id: leadId,
      channel_id: config.channelId,
      api_key: config.apiKey,
      url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      data: eventData
    };

    // Send the event data
    fetch(config.trackingEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      keepalive: true
    }).catch(error => {
      console.error("Error tracking event:", error);
    });
  }

  // Track page view on load
  window.addEventListener("load", function() {
    trackEvent("page_view");
  });
`

  // Add click tracking if enabled
  if (options.includeClickTracking) {
    script += `
  // Track clicks on elements with the 'teletracker' class
  document.addEventListener("click", function(e) {
    // Find closest teletracker element
    let target = e.target;
    while (target && !target.classList.contains("teletracker")) {
      target = target.parentElement;
    }
    
    if (!target) return;
    
    // Prevent default action
    e.preventDefault();
    
    // Get data attributes
    const action = target.getAttribute("data-action") || "join";
    const label = target.getAttribute("data-label") || "";
    
    // Track the click
    trackEvent("button_click", {
      action: action,
      label: label,
      element_id: target.id,
      element_class: target.className,
      element_text: target.innerText
    });
    
    // Create overlay for redirect
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.8);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;";
    
    // Create counter text
    const counterText = document.createElement("h2");
    counterText.style.cssText = "color:#fff;font-family:Arial,sans-serif;margin-bottom:20px;";
    
    // Add to DOM
    overlay.appendChild(counterText);
    document.body.appendChild(overlay);
    
    // Start countdown
    let counter = config.redirectDelay;
    counterText.textContent = "Redirecting in " + counter + " seconds...";
    
    const interval = setInterval(() => {
      counter--;
      counterText.textContent = "Redirecting in " + counter + " seconds...";
      
      if (counter <= 0) {
        clearInterval(interval);
        
        // Get invite link
        fetch(config.trackingEndpoint + "/invite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            api_key: config.apiKey,
            channel_id: config.channelId,
            lead_id: getLeadId()
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success && data.invite_link) {
            window.location.href = data.invite_link;
          } else {
            window.location.href = config.defaultInviteLink;
          }
        })
        .catch(error => {
          console.error("Error getting invite link:", error);
          window.location.href = config.defaultInviteLink;
        });
      }
    }, 1000);
  });
`
  }

  // Add Facebook Pixel tracking if enabled
  if (options.includePixel && options.pixelId) {
    script += `
  // Facebook Pixel tracking
  !function(f,b,e,v,n,t,s) {
    if (f.fbq) return;
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  // Initialize pixel
  fbq('init', '${options.pixelId}');
  fbq('track', 'PageView');
  
  // Track Facebook events to our server
  const originalFbq = window.fbq;
  window.fbq = function() {
    // Call original fbq
    originalFbq.apply(this, arguments);
    
    // Track the event to our server
    if (arguments.length >= 2) {
      const eventName = arguments[1];
      const params = arguments[2] || {};
      
      trackEvent("fb_" + eventName, params);
    }
  };
`
  }

  // Close the IIFE
  script += `
})();
`

  return script
}

/**
 * Generates a WordPress plugin for tracking
 */
export async function generateWordPressPlugin(channelId: string, options: TrackingScriptOptions = {}) {
  try {
    // Generate the tracking script
    const result = await generateTrackingScript(channelId, options)

    if (!result.success) {
      throw new Error(result.error)
    }

    // Get channel info
    const channel = await getChannel(channelId)

    if (!channel) {
      throw new Error(`Channel with ID ${channelId} not found`)
    }

    // Create the plugin PHP code
    const pluginCode = `<?php
/*
Plugin Name: TeleTracker for ${channel.name}
Plugin URI: https://teletracker.app
Description: Tracking integration for Telegram channel ${channel.username}
Version: 1.0
Author: TeleTracker
Author URI: https://teletracker.app
*/

// If this file is called directly, abort
if (!defined('WPINC')) {
    die;
}

// Define constants
define('TELETRACKER_VERSION', '1.0.0');
define('TELETRACKER_CHANNEL_ID', '${channelId}');
define('TELETRACKER_API_KEY', '${result.apiKey}');

// Add tracking script to footer
function teletracker_enqueue_script() {
    // Add inline script
    wp_register_script('teletracker', '', [], TELETRACKER_VERSION, true);
    wp_enqueue_script('teletracker');
    
    // Add the tracking code
    wp_add_inline_script('teletracker', ${JSON.stringify(result.script)});
}
add_action('wp_enqueue_scripts', 'teletracker_enqueue_script');

// Add shortcode for tracking buttons
function teletracker_button_shortcode($atts) {
    $atts = shortcode_atts(
        array(
            'text' => 'Join Our Telegram Channel',
            'action' => 'join',
            'label' => '',
            'class' => '',
            'style' => '',
        ),
        $atts,
        'teletracker'
    );
    
    $classes = 'teletracker';
    if (!empty($atts['class'])) {
        $classes .= ' ' . $atts['class'];
    }
    
    $style = '';
    if (!empty($atts['style'])) {
        $style = 'style="' . esc_attr($atts['style']) . '"';
    }
    
    return '<a href="#" class="' . esc_attr($classes) . '" ' . $style . ' data-action="' . esc_attr($atts['action']) . '" data-label="' . esc_attr($atts['label']) . '">' . esc_html($atts['text']) . '</a>';
}
add_shortcode('teletracker', 'teletracker_button_shortcode');

// Add admin menu
function teletracker_admin_menu() {
    add_options_page(
        'TeleTracker Settings',
        'TeleTracker',
        'manage_options',
        'teletracker',
        'teletracker_settings_page'
    );
}
add_action('admin_menu', 'teletracker_admin_menu');

// Settings page
function teletracker_settings_page() {
    ?>
    <div class="wrap">
        <h1>TeleTracker Settings</h1>
        <p>This plugin adds tracking for your Telegram channel <strong>${channel.username}</strong>.</p>
        
        <h2>Shortcode Usage</h2>
        <p>Use the following shortcode to add a tracking button to your pages or posts:</p>
        <pre>[teletracker text="Join Our Telegram Channel" action="join" label="homepage"]</pre>
        
        <h2>Available Attributes</h2>
        <ul>
            <li><strong>text</strong>: The button text (default: "Join Our Telegram Channel")</li>
            <li><strong>action</strong>: The action to track (default: "join")</li>
            <li><strong>label</strong>: A label for the button (default: "")</li>
            <li><strong>class</strong>: Additional CSS classes (default: "")</li>
            <li><strong>style</strong>: Inline CSS styles (default: "")</li>
        </ul>
        
        <h2>Manual Integration</h2>
        <p>You can also manually add tracking to any element by adding the <code>teletracker</code> class and data attributes:</p>
        <pre>&lt;a href="#" class="teletracker" data-action="join" data-label="custom"&gt;Join Now&lt;/a&gt;</pre>
    </div>
    <?php
}
`

    return { success: true, plugin: pluginCode, apiKey: result.apiKey }
  } catch (error) {
    console.error(`Error generating WordPress plugin for channel ${channelId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
