export type MasterNodeId = 
  | 'finance_wealth'        // Tab 1: Finance & Wealth Nodes (15 Tools)
  | 'dev_syntax'           // Tab 2: Dev Canvas & Core Syntax Hub (15 Tools)
  | 'text_parsers'          // Tab 3: Smart Text Wizards & String Parsers (15 Tools)
  | 'system_ops'            // Tab 4: System Ops & Infrastructure Trackers (12 Tools)
  | 'design_studio'         // Tab 5: Design Studio & Vector Canvas (13 Tools)
  | 'crypto_shields'        // Tab 6: Crypto Secure & Safety Shields (10 Tools)
  | 'marketing_suite'       // Tab 7: Advanced Marketing & Traffic Suite (10 Tools)
  | 'efficiency_academic';  // Tab 8: Efficiency Dials & Academic Utilities (10 Tools)

export type ToolCategory = 
  | 'all'
  | MasterNodeId
  | 'financial'
  | 'tech_utilities'
  | 'ai_media'
  | 'productivity_math'
  | 'productivity'
  | 'creator_dev'
  | 'analytics_marketing'
  | 'canvas_data_hacks'
  | 'layout_styling_engine'
  | 'parsers_system_checkers'
  | 'text_wizards_syntax'
  | 'core_web_infrastructure'
  | 'advanced_syntax_network'
  | 'advanced_sql_obfuscation'
  | 'enterprise_data_parsers'
  | 'advanced_metadata_cyber_text'
  | 'advanced_syntax_compressors_date'
  | 'advanced_schema_string_transformers';

export interface MasterNodeDefinition {
  id: MasterNodeId;
  name: string;
  tabLabel: string;
  tabNumber: number;
  expectedCount: number;
  icon: string;
  badge: string;
  accent: string;
  gradient: string;
  description: string;
}

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  categoryName: string;
  masterNode?: MasterNodeId;
  tagline: string;
  description: string;
  icon: string; // Lucide icon identifier
  badge?: 'Interactive Demo' | 'Popular' | 'New' | 'AI Powered' | 'Instant' | 'High Utility' | 'Audio Utility' | 'Dev Utility' | 'Security Utility' | 'Marketing' | 'Academic' | 'QA Testing' | 'Device Camera' | 'Writer Utility' | 'Design Utility' | 'Daily Tech' | 'Designer' | 'Productivity' | 'Tech Utility' | 'Database Utility' | string;
  gradient: string;
  accentColor: string;
  hasInteractiveDemo?: boolean;
  demoType?: 'sip' | 'emi' | 'compound' | 'gst' | 'fire' | 'cagr' | 'salary' | 'inflation' | 'caprate' | 'fdrd' | 'drip' | 'regex' | 'base64' | 'glassmorphism' | 'timestamp' | 'url' | 'markdown' | 'diff' | 'svg' | 'webp' | 'aspect' | 'exif' | 'social' | 'unit' | 'word' | 'percentage' | 'age' | 'split' | 'pomodoro' | 'pdf' | 'qr' | 'password' | 'color' | 'crypto' | 'json' | 'prompt_enhancer' | 'svg_wave' | 'safe_zone' | 'csv_markdown' | 'palette_extractor' | 'bpm_delay' | 'regex_visualizer' | 'password_analyzer' | 'utm_builder' | 'citation_formatter' | 'base64_image' | 'mock_profile' | 'html_entity' | 'qr_scanner' | 'case_wizard' | 'lorem_generator' | 'side_diff_checker' | 'resolution_monitor' | 'box_shadow_gradient' | 'markdown_html_converter' | 'user_agent_inspector' | 'client_hash_engine' | 'json_csv_flatten' | 'html_text_stripper' | 'timestamp_studio' | 'json_validator_linter' | 'ascii_art_generator' | 'word_reading_analytics' | 'css_minifier_optimizer' | 'crypto_random_generator' | 'url_encoder_decoder' | 'hex_rgb_converter' | 'html_table_generator' | 'dns_inspector' | 'text_line_sorter_stripper' | 'text_binary_converter' | 'json_keys_sorter' | 'html_beautifier_indenter' | 'latency_stream_checker' | 'bulk_multi_replace' | 'sql_query_formatter' | 'seo_slug_converter' | 'javascript_obfuscator' | 'roman_numerals_converter' | 'bulk_uuid_generator' | 'number_to_words' | 'json_to_xml' | 'html_markup_stripper' | 'network_local_tracker' | 'leap_year_matrix' | 'bencode_parser' | 'leet_speak_scrambler' | 'string_tokenizer' | 'image_color_inverter' | 'empty_line_trimmer' | 'json_to_yaml' | 'text_emoji_repeater' | 'html_code_minifier' | 'duration_days_calculator' | 'base64_to_text_decoder' | 'slug_to_text' | 'text_to_hex_encoder' | 'yaml_to_json_engine' | 'crypto_password_mixer' | 'torrent_bencode_json' | 'default';
  stats?: string;
  tags: string[];
}

export interface AdZoneConfig {
  showSkyscrapers: boolean;
  showMiddleBanner: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'reading';

export type GlobalCurrency = 'USD' | 'EUR' | 'GBP' | 'INR';

export interface ResearchDataResult {
  query: string;
  slug: string;
  title: string;
  category: string;
  snippetAnswer: string; // High-value 40-50 words acceptedAnswer for Google Rich Snippets / Featured Snippet
  bulletPoints: string[]; // Key technical breakdown & core principles
  technicalFormula?: string; // Mathematical or algorithmic formula
  practicalExample?: string; // Code snippet, calculation walk-through, or real-world example
  relevantToolId?: string; // Matching client-side utility ID from TOOLS_DATA
  relevantToolName?: string;
  schemaFaqJson: object; // Schema.org FAQPage JSON-LD
  schemaTechArticleJson: object; // Schema.org TechArticle JSON-LD
  sourceAttribution: string;
  computedDate: string;
  isCustomGenerated?: boolean;
}
