# frozen_string_literal: true

class Sanitize
  module Config
    HTTP_PROTOCOLS ||= ['http', 'https', :relative].freeze

    CLASS_WHITELIST_TRANSFORMER = lambda do |env|
      node = env[:node]
      class_list = node['class']&.split(' ')

      return unless class_list

      class_list.keep_if do |e|
        return true if e =~ /^(h|p|u|dt|e)-/ # microformats classes
        return true if e =~ /^(mention|hashtag)$/ # semantic classes
        return true if e =~ /^(ellipsis|invisible)$/ # link formatting classes
      end

      node['class'] = class_list.join(' ')
    end

    HEADER_DOWNSIZE_TRANSFORMER = lambda do |env|
      node = env[:node]
      return unless node.element?

      header_size = /^h([1-6])$/.match(node.name)
      return if !header_size

      new_header_size = [6, header_size[1].to_i + 2].min
      node.name = "h#{new_header_size}"
    end

    MASTODON_STRICT ||= freeze_config(
      elements: %w(p br span a h1 h2 h3 h4 h5 h6 em strong),

      attributes: {
        'a'    => %w(href rel class),
        'span' => %w(class),
      },

      add_attributes: {
        'a' => {
          'rel' => 'nofollow noopener',
          'target' => '_blank',
        },
      },

      protocols: {
        'a' => { 'href' => HTTP_PROTOCOLS },
      },

      transformers: [
        CLASS_WHITELIST_TRANSFORMER,
        HEADER_DOWNSIZE_TRANSFORMER,
      ]
    )

    MASTODON_OEMBED ||= freeze_config merge(
      RELAXED,
      elements: RELAXED[:elements] + %w(audio embed iframe source video),

      attributes: merge(
        RELAXED[:attributes],
        'audio'  => %w(controls),
        'embed'  => %w(height src type width),
        'iframe' => %w(allowfullscreen frameborder height scrolling src width),
        'source' => %w(src type),
        'video'  => %w(controls height loop width),
        'div'    => [:data]
      ),

      protocols: merge(
        RELAXED[:protocols],
        'embed'  => { 'src' => HTTP_PROTOCOLS },
        'iframe' => { 'src' => HTTP_PROTOCOLS },
        'source' => { 'src' => HTTP_PROTOCOLS }
      )
    )
  end
end
