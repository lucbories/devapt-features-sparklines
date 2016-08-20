
import T from 'typr'
import assert from 'assert'
import path from 'path'

import Devapt from 'devapt'

const RenderingPlugin = Devapt.RenderingPlugin

import Sparklines from './plugin/sparklines'


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
	constructor(arg_manager)
	{
		super(arg_manager, plugin_name, '1.0.0')
		
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
			case 'Sparklines': return new Sparklines(arg_name, arg_settings, arg_state)
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
			case 'Sparklines':   return Sparklines
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
}
