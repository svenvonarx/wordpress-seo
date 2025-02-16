import { Fragment, useState, useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import ReactAnimateHeight from "react-animate-height";
import classNames from "classnames";

import { addLinkToString } from "../../../../helpers/stringHelpers.js";
import Alert, { FadeInAlert } from "../../base/alert";
import SingleSelect from "../../base/single-select";
import { OrganizationSection } from "./organization-section";
import { PersonSection } from "./person-section";

/* eslint-disable complexity */

/**
 * The site representation step.
 *
 * @param {function} onOrganizationOrPersonChange Function to call when the organization/person select changes.
 * @param {function} dispatch                     A dispatch function to communicate with the Stepper store.
 * @param {Object}   state                        The Stepper store.
 * @param {boolean}  siteRepresentationEmpty      Whether the person or organization inputs are empty.
 *
 * @returns {WPElement} The site representation step component.
 */
export default function SiteRepresentationStep( { onOrganizationOrPersonChange, dispatch, state, siteRepresentationEmpty } ) {
	const [ sectionOpacity, setSectionOpacity ] = useState( state.companyOrPerson === "emptyChoice" ? "yst-opacity-0" : "yst-opacity-100" );
	const startOpacityTransition = useCallback( () => {
		setSectionOpacity( "yst-opacity-100" );
	} );

	const richResultsMessage = addLinkToString(
		sprintf(
			/* translators: %1$s expands to opening 'a' HTML tag, %2$s expands to closing 'a' HTML tag */
			__( "Completing this step will help Google to understand your website, and improve your chance of getting %1$srich results%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		"https://yoa.st/config-workout-rich-results",
		"yoast-configuration-rich-text-link"
	);

	return <Fragment>
		{  window.wpseoFirstTimeConfigurationData.knowledgeGraphMessage &&  <Alert type="info">
			{  window.wpseoFirstTimeConfigurationData.knowledgeGraphMessage }
		</Alert> }
		<p className={ classNames( "yst-text-sm yst-whitespace-pre-line yst-mb-6", state.shouldForceCompany ? "yst-mt-4" : "yst-mt-0" ) }>
			{
				state.shouldForceCompany
					? richResultsMessage
					: <Fragment>
						{ __( "Help us out here! Is your site about an organization or a person? ", "wordpress-seo" ) }
						{ richResultsMessage }
					</Fragment>
			}
		</p>
		<SingleSelect
			id="organization-person-select"
			htmlFor="organization-person-select"
			name="organization"
			label={ __( "Does your site represent an Organization or Person?", "wordpress-seo" ) }
			value={ state.shouldForceCompany ? "company" : state.companyOrPerson }
			onChange={ onOrganizationOrPersonChange }
			choices={ state.companyOrPersonOptions }
			disabled={ !! state.shouldForceCompany }
		/>
		<ReactAnimateHeight
			height={ [ "company", "person" ].includes( state.companyOrPerson ) ? "auto" : 0 }
			duration={ 400 }
			easing="linear"
			onAnimationEnd={ startOpacityTransition }
		>
			<div className={ classNames( "yst-transition-opacity yst-duration-300 yst-mt-6", sectionOpacity ) }>
				{ state.companyOrPerson === "company" && <OrganizationSection
					dispatch={ dispatch }
					imageUrl={ state.companyLogo }
					organizationName={ state.companyName }
				/> }
				{ state.companyOrPerson === "person" && <PersonSection
					dispatch={ dispatch }
					imageUrl={ state.personLogo }
					person={ {
						id: state.personId,
						name: state.personName,
					} }
					canEditUser={ !! state.canEditUser }
				/> }
			</div>
		</ReactAnimateHeight>
		<FadeInAlert
			id="site-representation-empty-alert"
			isVisible={ siteRepresentationEmpty }
			className="yst-mt-6"
		>
			{
				addLinkToString(
					sprintf(
						__(
							"Please be aware that you need to fill out all settings in this step to get the most value out of structured data. %1$sRead more about the importance of structured data%2$s.",
							"wordpress-seo"
						),
						"<a>",
						"</a>"
					),
					"https://yoa.st/config-workout-structured-data",
					"yoast-configuration-structured-data-link"
				)
			}
		</FadeInAlert>
	</Fragment>;
}

SiteRepresentationStep.propTypes = {
	onOrganizationOrPersonChange: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
	state: PropTypes.object.isRequired,
	siteRepresentationEmpty: PropTypes.bool.isRequired,
};
