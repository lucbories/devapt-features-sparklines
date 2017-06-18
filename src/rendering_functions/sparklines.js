
// NPM IMPORTS
import h from 'virtual-dom/h'

// DEVAPT CORE COMMON IMPORTS
// import T                  from 'devapt-core-common/dist/js/utils/types'
import DefaultRenderingPlugin from 'devapt-core-common/dist/js/default_plugins/rendering_default_plugin'


const rendering_normalize = DefaultRenderingPlugin.find_rendering_function('rendering_normalize')
const plugin_name = 'Sparklines' 
const context = plugin_name + '/sparklines'



// DEFAULT STATE
const default_state = {
}

// DEFAULT SETTINGS
const default_settings = {
	type: 'sparklines',
	class:undefined,
	style:undefined,
	id:undefined
}



/**
 * Button rendering with given state, produce a rendering result.
 * 
 * @param {object} arg_settings - rendering item settings.
 * @param {object} arg_state - component state.
 * @param {object} arg_rendering_context - rendering context: { trace_fn:..., topology_defined_application:..., credentials:..., rendering_factory:... }.
 * @param {RenderingResult} arg_rendering_result - rendering result to update.
 * 
 * @returns {RenderingResult} - updated Rendering result: VNode or Html text, headers.
 */
export default (arg_settings={}, arg_state={}, arg_rendering_context, arg_rendering_result)=>{
	// NORMALIZE ARGS
	const { settings, state, rendering_context, rendering_result } = rendering_normalize(default_settings, default_state, arg_settings, arg_state, arg_rendering_context, arg_rendering_result, context)
	// const rendering_factory = rendering_context ? rendering_context.rendering_factory : undefined
	
	// BUILD TAG
	const canvas = h('canvas')
	const tag_id = settings.id
	const tag_children = [canvas]
	const tag_props = { id:tag_id, style:settings.style, className:(settings.class ? settings.class  + ' sparkline' : 'sparkline') }
	const tag = h('span', tag_props, tag_children)
	
	rendering_result.add_vtree(tag_id, tag)

	rendering_result.add_body_scripts_urls(
		[
			{
				id:'js-sparklines',
				src:'plugins/' + plugin_name + '/sparklines.js'
			}
		]
	)

	return rendering_result
}
