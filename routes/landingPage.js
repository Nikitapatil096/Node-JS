/**
 * This module renders landing pages when its route is requested
 * It is used for pages like about and home page
 */
const url = require('url')

const { getLandingPage } = require('../services/contentful')
const attachEntryState = require('./../lib/entry-state')

/**
 * Renders a landing page when `/` or `/about` route is requested
 * based on the pathname an entry is queried from contentful
 * and a view is rendered from the pulled data
 *
 * @param request - Object - Express request
 * @param response - Object - Express response
 * @param next - Function - Express callback
 * @returns {undefined}
 */
module.exports.getLandingPage = async (request, response, next) => {
  let pathname = url.parse(request.url).pathname.split('/').filter(Boolean)[0]
  pathname = pathname || 'home'
  let landingPage = await getLandingPage(
    pathname,
    response.locals.currentLocale.code,
    response.locals.currentApi.id
  )

  // Attach entry state flags when using preview APIs
  if (response.locals.settings.editorialFeatures && response.locals.currentApi.id === 'cpa') {
    landingPage = await attachEntryState(landingPage)
  }

  response.render('landingPage', { title: pathname, landingPage })
}

