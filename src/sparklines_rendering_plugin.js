// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import path from 'path'
import Devapt from 'devapt'

const RenderingPlugin = Devapt.RenderingPlugin

// PLUGIN IMPORTS
import SparklinesComponent from './components/sparklines'
import sparklines_rf from './rendering_functions/sparklines'


const plugin_name = 'Sparklines' 
const context = plugin_name + '/Sparklines_rendering_plugin'



export default class SparklinesPlugin extends RenderingPlugin
{
	/**
     * Feature plugin constructor.
	 * 
     * @param {PluginManager} arg_manager - feature plugins manager.
	 * 
     * @returns {nothing}
     */
	constructor(arg_runtime, arg_manager)
	{
		super(arg_runtime, arg_manager, plugin_name, '1.0.0')
		
		const base_dir = __dirname + '/../node_modules/sparklines/source'
		this.add_public_asset('js', '/' + plugin_name + '/sparklines.js', path.join(base_dir, 'sparkline.js') )
	}
	
	
    
	/**
     * Get a feature class.
	 * 
     * @param {string} arg_class_name - feature class name.
	 * 
     * @returns {object} feature class.
     */
	get_feature_class(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':get_class:bad class string')
		
		return SparklinesPlugin.get_class(arg_class_name)
	}
	
	

	/**
     * Create a feature class instance.
	 * 
     * @param {string} arg_class_name - feature class name.
     * @param {string} arg_name - feature instance name.
     * @param {object} arg_settings - feature instance settings.
     * @param {object} arg_state - feature instance state.
	 * 
     * @returns {object} feature class instance.
	 */
	create(arg_class_name, arg_name, arg_settings, arg_state)
	{
		assert( T.isString(arg_class_name), context + ':create:bad class string')
		
		switch(arg_class_name)
		{
			case 'Sparkline':
			case 'Sparklines': return new SparklinesComponent(arg_name, arg_settings, arg_state)
		}
		
		assert(false, context + ':create:bad class name')
		return undefined
	}
	
	

	/**
     * Get a feature class.
	 * @static
	 * 
     * @param {string} arg_class_name - feature class name.
	 * 
     * @returns {object} feature class.
	 */
	static get_class(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':get_class:bad class string')
		
		switch(arg_class_name)
		{
			case 'Sparkline':
			case 'Sparklines':   return SparklinesComponent
		}
		
		assert(false, context + ':get_class:bad class name')
		return undefined
	}
	
	

	/**
     * Test if plugin has a feature class.
	 * 
     * @param {string} arg_class_name - feature class name.
	 * 
     * @returns {boolean}
	 */
	has(arg_class_name)
	{
		switch(arg_class_name)
		{
			case 'Sparkline':
			case 'Sparklines':
				return true
		}
		
		return false
	}


	
	/**
	 * Find a rendering function.
	 * 
	 * @param {string} arg_type - rendering item type.
	 * 
	 * @returns {Function} - rendering function.
	 */
	static find_rendering_function(arg_type)
	{
		// console.log(context + ':find_rendering_function:type=' + arg_type)

		if ( ! T.isString(arg_type) )
		{
			console.warn(context + ':find_rendering_function:bad type=' + arg_type, T.isString(arg_type), typeof arg_type, arg_type)
			return undefined
		}
		
		
		switch(arg_type.toLocaleLowerCase())
		{
			// RENDERING FUNCTIONS
			case 'sparklines':
				// console.log(context + ':find_rendering_function:found type=' + arg_type)
				return sparklines_rf
		}

		// console.log(tabs, context + ':find_rendering_function:not found type=' + arg_type.toLocaleLowerCase())
		return undefined
	}
}
