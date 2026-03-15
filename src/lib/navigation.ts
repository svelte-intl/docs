import { defineNavigation } from "@svecodocs/kit";
import ChalkboardTeacher from "phosphor-svelte/lib/ChalkboardTeacherIcon";
import RocketLaunch from "phosphor-svelte/lib/RocketLaunchIcon";
import Tag from "phosphor-svelte/lib/TagIcon";
import { getAllDocs } from "./utils.js";

const allDocs = getAllDocs();

const miscellaneous = allDocs
	.filter((doc) => doc.section === "Miscellaneous")
	.map((doc) => ({
		title: doc.title,
		href: `/docs/${doc.slug}`,
	}));

export const navigation = defineNavigation({
	anchors: [
		{
			title: "Introduction",
			href: "/docs",
			icon: ChalkboardTeacher,
		},
		{
			title: "Getting Started",
			href: "/docs/getting-started",
			icon: RocketLaunch,
		},
		{
			title: "Releases",
			href: "https://github.com/svelte-intl/core/releases",
			icon: Tag,
		},
	],
	sections: [
		{
			title: "Miscellaneous",
			items: miscellaneous,
		}
	]
});
