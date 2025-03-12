ace.define("ace/mode/music_highlight_rules", ["require", "exports", "ace/mode/text_highlight_rules"], function (require, exports) {
  const TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

  const MusicHighlightRules = function () {
    this.$rules = {
      start: [
        {
          token: "note",
          regex: "[a-gA-G]'+?\\d?",
        },
        {
          token: "chord",
          regex: "<[a-gA-G]+'?\\d?( [a-gA-G]+'?\\d?)*>",
        },
        {
          token: "chord-duration",
          regex: "<[a-gA-G]+'?\\d?( [a-gA-G]+'?\\d?)*>\\d",
        },
        {
          token: "sequence",
          regex: "\\([a-gA-G]+'?\\d?( [a-gA-G]+'?\\d?)*\\)",
        },
        {
          token: "repetition",
          regex: "[a-gA-G]+'?\\d?x\\d+",
        },
        {
          token: "comment",
          regex: "#.*$",
        },
        {
          token: "duration",
          regex: "\\d",
        },
        {
          token: "paren.lparen",
          regex: "[()]",
        },
        {
          token: "angle.bracket",
          regex: "[<>]",
        },
      ],
    };

    MusicHighlightRules.prototype.normalizeRules.call(this); // ✅ Corrected
  };

  // ✅ Ensure MusicHighlightRules extends TextHighlightRules
  MusicHighlightRules.prototype = Object.create(TextHighlightRules.prototype);
  MusicHighlightRules.prototype.constructor = MusicHighlightRules;

  exports.MusicHighlightRules = MusicHighlightRules;
});

ace.define("ace/mode/music", ["require", "exports", "ace/mode/text", "ace/mode/music_highlight_rules"], function (require, exports) {
  const TextMode = require("ace/mode/text").Mode;
  const MusicHighlightRules = require("ace/mode/music_highlight_rules").MusicHighlightRules;

  const Mode = function () {
    this.HighlightRules = MusicHighlightRules;
  };

  // ✅ Ensure Mode correctly extends TextMode
  Mode.prototype = Object.create(TextMode.prototype);
  Mode.prototype.constructor = Mode;
  Mode.prototype.$id = "ace/mode/music";

  exports.Mode = Mode;
});

// ✅ Register the mode so Ace can find it
ace.config.setModuleUrl("ace/mode/music", new URL(import.meta.url).href);
