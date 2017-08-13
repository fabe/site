module Jekyll
  class RenderFigureTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @text = text.split('|').map(&:strip)
      @path = @text.at(0)
      @caption = @text.at(1)
      @class = @text.at(2)
    end

    def render(context)
      "<figure class='#{@class}'>
        <img src='#{@path}' alt='#{@caption}' />
        <figcaption><p>#{@caption}</p></figcaption>
      </figure>"
    end
  end
end

Liquid::Template.register_tag('figure', Jekyll::RenderFigureTag)
