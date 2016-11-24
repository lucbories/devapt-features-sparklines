
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
	/**
	 * Creates an instance of Component.
	 * @extends Bindable
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_state - component state.
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_state, arg_log_context)
	{	
		super(arg_runtime, arg_state, arg_log_context ? arg_log_context : context)

		this.init()
	}
	
	
	update_values(values)
	{
		// console.log('sparklines values', values)
		
		this.sparkline.draw(values)
	}

	
	init()
	{
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

		this.sparkline = new Sparkline(elm, options)
		this.update_values(values)
	}
}
