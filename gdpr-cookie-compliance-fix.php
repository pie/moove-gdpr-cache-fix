<?php
/*
Plugin Name: GDPR Cookie Compliance: Cache Fix
Description: Adds a fix to to cache the Moove GDPR post requests client side
Version:     0.1
Author:      The team at PIE
Author URI:  http://pie.co.de
License:     GPL3
License URI: https://www.gnu.org/licenses/gpl-3.0.html
*/

/* PIE\GDPRCookieComplianceFix is free software: you can redistribute it and/or modify it under the terms of the GNU General License as published by the Free Software Foundation, either version 2 of the License, or any later version.

PIE\GDPRCookieComplianceFix is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General License for more details.

You should have received a copy of the GNU General License along with PIE\GDPRCookieComplianceFix. If not, see https://www.gnu.org/licenses/gpl-3.0.en.html */

namespace PIE\GDPRCookieComplianceFix;

/**
 * Load in JS for admin screen
 */
function enqueue_scripts() {
  if ( ! is_admin() ){
    wp_enqueue_script( 'gdpr-cookie-compliance-fix', plugins_url( '/js/gdpr-cookie-compliance-fix.js', __FILE__ ), array( 'jquery' ), '0.1', true );
  }
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_scripts' );
