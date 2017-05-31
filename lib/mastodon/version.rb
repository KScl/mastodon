# frozen_string_literal: true

module Mastodon
  module Version
    module_function

    def set_git
      g = `git describe --tags`.chomp
      g_dif = g.index('-')
      g_rev = g.index('-', g_dif + 1)
      g_dif_text = g[g_dif + 1..g_rev - 1]
      g_rev_text = g[g_rev + 2, 7]

      @git = " +#{g_dif_text} (#{g_rev_text})"
    end

    def major
      1
    end

    def minor
      5
    end

    def patch
      0
    end

    def pre
      nil
    end

    def flags
      ''
    end

    def to_a
      [major, minor, patch, pre].compact
    end

    def to_s
      [to_a.join('.'), flags, @git].join
    end
  end
end

Mastodon::Version.set_git
