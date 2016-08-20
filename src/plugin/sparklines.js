
import T from 'typr'
import assert from 'assert'

import Devapt from 'devapt'

// const RenderingPlugin = Devapt.DefaultRenderingPlugin
// const DefaultButton = RenderingPlugin.get_class('Button')
const Component = Devapt.Component


const plugin_name = 'Sparklines' 
const context = plugin_name + '/sparklines'



export default class Sparklines extends Component
{
	constructor(arg_name, arg_settings)
	{
		// UPDATE SETTINGS
		arg_settings = Component.normalize_settings(arg_settings)
		arg_settings.scripts_urls = arg_settings.scripts_urls.concat(
			[
				'plugins/Sparklines/sparklines.js'
			]
		)
		
		
		const js_init = Sparklines.get_init_script(arg_name)
		arg_settings.scripts = arg_settings.scripts ? arg_settings.scripts : []
		arg_settings.scripts.push(js_init)
		
		super(arg_name, arg_settings)
	}
	
	
	
	get_initial_state()
	{
		return {
			label:'no abel',
			options:null
		}
	}
	
	
	static get_init_script(arg_name)
	{
		return `
		$(document).ready(
			function()
			{
				var view = window.devapt().ui('${arg_name}')

				view.update_values = function(values) {
					// console.log('sparklines values', values)
					
					this.sparkline.draw(values)
				}

				view.init = function() {
					var elm = document.getElementById( view.get_dom_id() )

					var view_state = this.get_state().toJS()
					var values = view_state.items ? view_state.items : []
					var options = view_state.options ? view_state.options : {}
					
					options.endColor = options.endColor ? options.endColor : 'blue'
					options.lineWidth = options.lineWidth ? options.lineWidth : '3'
					options.index_multiple = options.index_multiple ? options.index_multiple : 1

					var tooltip_template_value = '{value}'
					var tooltip_template_index = '{index}'
					var tooltip_template = 'value [' + tooltip_template_value + '] at [' + tooltip_template_index + ']'
					if (options.tooltip && (typeof options.tooltip == 'string') )
					{
						tooltip_template = options.tooltip
					}
					options.tooltip = function(value, index, array) {
						var evaluated_index = (array.length - index) * options.index_multiple
						return tooltip_template.replace(tooltip_template_value, value).replace(tooltip_template_index, evaluated_index)
					}

					view.sparkline = new Sparkline(elm, options)
					view.update_values(values)
				}

				view.init()
			}
		)
		`
	}
	
	
	
	/**
	 * Render Cytoscape.
	 * 
	 * @returns {string} - html
	 */
	render_main()
	{
		// console.info(context + ':render_main')
		
		assert( T.isObject(this.state), context + ':render:bad state object')
		
		// GET ATTRIBUTES
		const css_class1 = T.isString(this.state.css_class) ? this.state.css_class : undefined
		const css_class2 = this.get_css_classes_for_tag('sparklines')
		const css_class = (css_class1 ? css_class1 + ' ' : '') + (css_class2 ? css_class2 : '') + ' sparkline'
		
		const css_attributes1 = T.isString(this.state.css_attributes) ? this.state.css_attributes : undefined
		const css_attributes2 = this.get_css_attributes_for_tag('sparklines')
		const css_attributes = (css_attributes1 ? css_attributes1 + ' ' : '') + (css_class2 ? css_attributes2 : '')
		
		// BUILD HTML ELEMENT
		const html_id = 'id="' + this.get_dom_id() + '"'
		const html_css_class = (css_class && css_class != '') ? `class="${css_class}"` : ''
		const html_css_attributes = (css_attributes && css_attributes != '') ? `style="${css_attributes}"` : ''
		
		const html = `<span ${html_id} ${html_css_class} ${html_css_attributes}></canvas></span>\n`
		// console.info(context + ':render:html', html)
		
		return html
	}
}
