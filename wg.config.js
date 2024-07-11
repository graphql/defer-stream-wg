// @ts-check

/** @type {import('wgutils').Config} */
const config = {
  name: "Incremental Delivery WG",
  repoUrl: "https://github.com/graphql/defer-stream-wg",
  videoConferenceDetails: `https://zoom.us/j/92252078709
  - _Password:_ graphqlwg`,
  liveNotesUrl:
    "https://docs.google.com/document/d/1_4u4vHKeIyowo6ViGCJxE8ce-ihwcR5aoSqT0ZDQuf0/edit?usp=sharing",
  timezone: "US/Eastern",
  frequency: "monthly",
  nth: 2,
  weekday: "M", // M, Tu, W, Th, F, Sa, Su
  time: "11:30-12:30", // 24-hour clock, range
  attendeesTemplate: `\
| Name                       | GitHub               | Organization       | Location                 |
| :------------------------- | :------------------- | :----------------- | :----------------------- |
| Rob Richard (Host)         | @robrichard          | 1stDibs            | Jersey City, NJ, US      |
`,
  agendasFolder: "agendas",
  dateAndTimeLocations:
    "p1=224&p2=179&p3=136&p4=268&p5=367&p6=438&p7=248&p8=240",
  description: `\
To read about the purpose of this subcommittee, please see [the README](../../README.md).
`,
  agendaTemplateBottom: `\
1. Review previous meeting's action items (5m, Host)
   - [Ready for review](https://github.com/graphql/defer-stream-wg/issues?q=is%3Aissue+is%3Aopen+label%3A%22Ready+for+review+%F0%9F%99%8C%22+sort%3Aupdated-desc)
   - [All open action items (by last update)](https://github.com/graphql/defer-stream-wg/issues?q=is%3Aissue+is%3Aopen+label%3A%22Action+item+%3Aclapper%3A%22+sort%3Aupdated-desc)
`
};

module.exports = config;
