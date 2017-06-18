
// NPM IMPORTS
import assert from 'assert'

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS
import Component from 'devapt-core-browser/dist/js/base/component'


const plugin_name = 'Sparklines' 
const context = plugin_name + '/sparklines'



export default class Sparklines extends Component
{
	/**
	 * Creates an instance of Component.
	 * @extends Component
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_state - component state.
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_state, arg_log_context=context)
	{	
		super(arg_runtime, arg_state, arg_log_context)

		this._is_initialized = false

		// this.enable_trace()

		this.init()
	}
	
	
	_update_self(arg_prev_element, arg_new_element)
	{
		this.enter_group('_update_self')

		if (! this._is_initialized)
		{
			this.debug('_update_self:not yet initialized')
			this.leave_group('_update_self')
			return
		}

		// console.log(context + ':_update_self:%s:', this.get_name(), arg_prev_element, arg_new_element)

		if (arg_prev_element != arg_new_element)
		{
			this.debug('_update_self:previous element != new element')
			
			if (this.sparkline)
			{
				this.debug('_update_self:this.sparkline exists, delete it')

				if ( arg_prev_element.children.length > 0 && arg_new_element.children.length == 0 )
				{
					arg_new_element.innerHTML = arg_prev_element ? arg_prev_element.innerHTML : '<canvas></canvas>'
				}
				delete this.sparkline
			}
		}

		if (! this.sparkline)
		{
			this.debug('_update_self:this.sparkline doesn t exists')

			if (! window.Sparkline)
			{
				throw 'Sparkline file not found on update'
			}

			this.debug('_update_self:create this.sparkline')

			// if (arg_new_element.children.length == 0 || arg_new_element.innerHTML.toLocalLowerCase().search('canvas') < 0)
			// {
			// 	this.debug('_update_self:create canvas element')
			// 	arg_new_element.appendChild( document.createElement('canvas') )
			// }

			this.sparkline = new window.Sparkline(arg_new_element, this.options)
			
		}
		
		this.debug('_update_self:this.sparkline exists')

		const values = this.get_state_value('items', [])
		// console.log(context + ':update:values', values)

		if ( T.isArray(values) && values.length > 0 )
		{
			this.debug('_update_self:draw values')
			this.sparkline.draw(values)
		}

		this.leave_group('_update_self')
	}


	handle_items_change(arg_path, arg_previous_value, arg_new_value)
	{
		this.enter_group('handle_items_change')
		// console.log(context + ':handle_items_change', arg_path, arg_previous_value, arg_new_value)

		if (this._is_initialized && this.sparkline)
		{
			const values = arg_new_value && arg_new_value.toJS() ? arg_new_value.toJS() : []
			if ( T.isArray(values) && values.length > 0 )
			{
				this.sparkline.draw(values)
			}

			this.leave_group('handle_items_change')
			return
		}

		this.debug('_update_self:not yet initialized')
		this.leave_group('handle_items_change')
	}
	
	
	update_values(values)
	{
		this.enter_group('update_values')

		// GET COMPONENT STATE
		var view_state = this.get_state().toJS()

		// DEBUG
		// console.log(context + ':update_values', values)
		// console.log(context + ':update_values:view_state', view_state)

		// UPDATE COMPONENT STATE ITEMS
		view_state.items = T.isArray(values) ? values : []

		// PROPAGATE STATE CHANGE
		this.dispatch_action('ADD_JSON_RESOURCE', {resource:this.get_name(), path:this.get_state_path(), json:view_state})

		this.leave_group('update_values')
	}

	
	init()
	{
		this.enter_group('init')

		var self = this
		var elm = this.get_dom_element()

		// if (elm.children.length == 0 || elm.innerHTML.search('canvas') < 0)
		// {
		// 	this.debug('init:create canvas element')
		// 	elm.appendChild( document.createElement('canvas') )
		// }

		// DEBUG
		// console.log(this.get_name(), context + ':this.get_name()')
		// console.log(this.get_dom_id(), context + ':this.get_dom_id()')
		// console.log(context + ':init:elm=', elm)

		var view_state = this.get_state().toJS()
		var values = view_state.items ? view_state.items : []
		
		this.options = view_state.options ? view_state.options : {}
		
		this.options.endColor       = this.options.endColor       ? this.options.endColor : 'blue'
		this.options.lineWidth      = this.options.lineWidth      ? this.options.lineWidth : '3'
		this.options.index_multiple = this.options.index_multiple ? this.options.index_multiple : 1

		var tooltip_template_value = '{value}'
		var tooltip_template_index = '{index}'
		var tooltip_template = 'value [' + tooltip_template_value + '] at [' + tooltip_template_index + ']'
		if (this.options.tooltip && (typeof this.options.tooltip == 'string') )
		{
			tooltip_template = this.options.tooltip
		}
		this.options.tooltip = function(value, index, array) {
			if (value && array)
			{
				const evaluated_index = (array.length - index) * self.options.index_multiple
				return tooltip_template.replace(tooltip_template_value, value).replace(tooltip_template_index, evaluated_index)
			}
			return undefined
		}

		const script_loaded_handle = ()=>{
			this.debug('init:script loaded handle')

			if (! window.Sparkline)
			{
				this.debug('init:window.Sparkline not found')
				setTimeout(script_loaded_handle, 500)
				return
			}

			self.sparkline = new window.Sparkline(elm, self.options)

			// DEBUG
			// console.log(this.sparkline, context + ':self.sparkline')

			self.sparkline.draw([0])

			assert( T.isObject(self.sparkline), context + ':self.sparkline bad object')
			self.update_values(values)


			this.register_state_value_change_handle(['items'], 'handle_items_change')
			this._is_initialized = true
		}

		if (window.Sparkline)
		{
			this.debug('init:window.Sparkline found')
			script_loaded_handle()
			this.leave_group('init')
			return
		}

		setTimeout(script_loaded_handle, 500)

		this.leave_group('init')
	}
}
