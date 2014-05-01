(function(){
    var api     = '/',
        tag_selected_count  = 0,
        elem    = {
            get : function(selector){
                if(this[selector]){
                    return this[selector];
                }

                var $t  = $(selector);
                if(! $t){return null}

                this[selector]  = $t;
                return $t;
            }
        };

    var TagModel    = Backbone.Model.extend({
        url : api,
        defaults    : function(){
            return {
                tag_id          : null,
                tag_name        : '',
                tag_selected    : false
            };
        },
        toggle  : function(){
            this.set({tag_selected : !this.get('tag_selected')});
        }
    });

    var TagView     = Backbone.View.extend({
        template    : null,
        $label      : null,
        initialize  : function(){
            this.template   = _.template(elem.get('#tag_template').html());
            this.$label     = this.$el.children('a');
            this.listenTo(this.model, 'change', this.render);
        },
        events  : {
            'click a'    : 'toggle'
        },
        toggle  : function(){
            this.model.toggle();
        },
        render      : function(){
            if(this.model.get('tag_selected')){
                this.addToTagList();
            }
            else{
                this.removeFromTagList();
            }
        },
        addToTagList   : function(){
            this.$label.addClass('selected');
            var html    = this.template(this.model.attributes);
            elem.$selected_list.append(html);

            if(! tag_selected_count){
                elem.$tag_all.hide();
            }
            tag_selected_count++;
        },
        removeFromTagList  : function(){
            this.$label.removeClass('selected');
            var selector  = '#tag_' +this.model.get('tag_id');
            $(selector).remove();

            tag_selected_count--;
            if(! tag_selected_count){
                elem.$tag_all.show();
            }
        }
    });

    $(function(){
        var tag_selected_count  = $('#selected_list li').length - 1;
        
        elem.$selected_list     = $('#selected_list');
        elem.$tag_all = $('#tag_all');

        $('a.tag').on({
            click   : function(e){
                e.preventDefault();
            }
        });

        $('#tag_list li').each(function(e){
            var data    = {};
            var li      = $(this);
            data.tag_name  = li.children('.tag_name').val();
            data.tag_id    = li.children('.tag_id').val() -0;
            data.selected  = li.children('.tag_selected').val() -0;

            var model   = new TagModel(data);
            var view    = new TagView({
                                el  : li,
                                model: model
                            });
        });
    });

})();
