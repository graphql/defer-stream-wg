#!/usr/bin/env node

/**
 * This tool generates new agenda files in a consistent format. When making
 * changes to future agenda templates, please make the changes to this tool
 * first, then generate files.
 *
 * To use this tool, provide year and month as command arguments
 *
 *  tools/gen-agenda.js 2023 6
 *
 */

// Set timezone to NY
process.env.TZ = 'America/New_York';

const fs = require("fs");
const path = require("path");

// Get arguments
const [year, month] = process.argv
  .slice(2)
  .map((n) => parseInt(n, 10))
  .sort((a, b) => b - a);
if (!year || !month) {
  console.error(`Must provide command arguments of year and month
  tools/gen-agenda.js 2023 6
`);
  process.exit(1);
}
const today = new Date();
if (year < today.getFullYear() - 3 || year > today.getFullYear() + 9) {
  console.error(
    `Invalid year '${year}', please select a recent or close future year`
  );
  process.exit(1);
}
if (month < 1 || month > 12) {
  console.error(`Invalid month '${month}', must be between 1 and 12`);
  process.exit(1);
}

// Repository root assuming this script is in a subdirectory.
const repoRoot = path.resolve(__dirname, "../");

// For all three meetings in a month, fill and write the template
const meetings = getMeetings(year, month);
for (const meeting of meetings) {
  const contents = fillMeetingTemplate(meeting);

  // Create missing directories recursively and write file.
  const absPath = path.join(repoRoot, meeting.filePath);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, contents);
  console.log(`Wrote file: ${meeting.filePath}`);
}

// --------------------------------------------------------------------------

function fillMeetingTemplate(meeting) {
  return t`<!--

Hello! You're welcome to join our subcommittee meeting and add to the agenda
by following these three steps:

   1. Add your name to the list of attendees (in alphabetical order).

      - To respect meeting size, attendees should be relevant to the agenda.
        That means we expect most who join the meeting to participate in
        discussion. If you'd rather just watch, check out our YouTube[1].

      - Please include the organization (or project) you represent, and the
        location (including country code[2]) you expect to be located in during
        the meeting.

      - If you're willing to help take notes, add "✏️" after your name
        (eg. Ada Lovelace ✏). This is hugely helpful!

   2. If relevant, add your topic to the agenda (sorted by expected time).

      - Every agenda item has four parts: 1) the topic, 2) an expected time
        constraint, 3) who's leading the discussion, and 4) a list of any
        relevant links (RFC docs, issues, PRs, presentations, etc). Follow the
        format of existing agenda items.

      - Know what you want to get out of the agenda topic - what feedback do you
        need? What questions do you need answered? Are you looking for consensus
        or just directional feedback?

      - If your topic is a new proposal it's likely an "RFC 0"[3]. The barrier
        of entry for documenting new proposals is intentionally low, writing a
        few sentences about the problem you're trying to solve and the rough
        shape of your proposed solution is normally sufficient.

        You can create a link for this:
          - As an issue against this repo.
          - As a GitHub discussion in this repo.
          - As an RFC document into the rfcs/ folder of this repo.

   3. Review our guidelines and agree to our Spec Membership & CLA.

      - Review and understand our Spec Membership Agreement, Participation &
        Contribution Guidelines, and Code of Conduct. You'll find links to these
        in the first agenda item of every meeting.

      - If this is your first time, our bot will comment on your Pull Request
        with a link to our Spec Membership & CLA. Please follow along and agree
        before your PR is merged.

        Your organization may sign this for all of its members. To set this up,
        please ask operations@graphql.org.

PLEASE TAKE NOTE:

  - By joining this meeting you must agree to the Specification Membership
    Agreement and Code of Conduct.

  - Meetings are recorded and made available on YouTube[1], by joining you
    consent to being recorded.

[1] Youtube: https://www.youtube.com/channel/UCERcwLeheOXp_u61jEXxHMA
[2] Country codes: https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes#Current_ISO_3166_country_codes
[3] RFC stages: https://github.com/graphql/graphql-spec/blob/main/CONTRIBUTING.md#rfc-contribution-stages

-->

| This is an open meeting: To attend or add agenda, send a Pull Request against this file. |
| ---------------------------------------------------------------------------------------- |

# GraphQL Incremental Delivery WG – ${meeting.fullDate})

To read about the purpose of this subcommittee, please see [the README](../../README.md).

This is an open meeting in which anyone in the GraphQL community may attend.

- **Date & Time**: [${meeting.dateTimeRange}](${meeting.timeLink})
  - View the [calendar][], or subscribe ([Google Calendar][], [ical file][]).
  - _Please Note:_ The date or time may change. Please check this agenda the
    week of the meeting to confirm. While we try to keep all calendars accurate,
    this agenda document is the source of truth.
- **Video Conference Link**: https://zoom.us/j/92252078709
  - _Password:_ graphqlwg
- **Live Notes**: [Google Doc Notes](https://docs.google.com/document/d/1_4u4vHKeIyowo6ViGCJxE8ce-ihwcR5aoSqT0ZDQuf0/edit?usp=sharing)

[calendar]: https://calendar.google.com/calendar/embed?src=linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8%40group.calendar.google.com
[google calendar]: https://calendar.google.com/calendar?cid=bGludXhmb3VuZGF0aW9uLm9yZ19pazc5dDl1dWoycDMyaTNyMjAzZGd2NW1vOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t
[ical file]: https://calendar.google.com/calendar/ical/linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8%40group.calendar.google.com/public/basic.ics
[google doc notes]: https://docs.google.com/document/d/1_4u4vHKeIyowo6ViGCJxE8ce-ihwcR5aoSqT0ZDQuf0/edit?usp=sharing

## Attendees

| Name                       | GitHub               | Organization       | Location                 |
| :------------------------- | :------------------- | :----------------- | :----------------------- |
| Rob Richard (Host)         | @robrichard          | 1stDibs            | Jersey City, NJ, US      |


## Agenda

1. Agree to Membership Agreement, Participation & Contribution Guidelines and Code of Conduct (1m, Host)
   - [Specification Membership Agreement](https://github.com/graphql/foundation)
   - [Participation Guidelines](https://github.com/graphql/graphql-wg#participation-guidelines)
   - [Contribution Guide](https://github.com/graphql/graphql-spec/blob/main/CONTRIBUTING.md)
   - [Code of Conduct](https://github.com/graphql/foundation/blob/master/CODE-OF-CONDUCT.md)
1. Introduction of attendees (5m, Host)
1. Determine volunteers for note taking (1m, Host)
1. Review agenda (2m, Host)
1. Review previous meeting's action items (5m, Host)
   - [Ready for review](https://github.com/graphql/defer-stream-wg/issues?q=is%3Aissue+is%3Aopen+label%3A%22Ready+for+review+%F0%9F%99%8C%22+sort%3Aupdated-desc)
   - [All open action items (by last update)](https://github.com/graphql/defer-stream-wg/issues?q=is%3Aissue+is%3Aopen+label%3A%22Action+item+%3Aclapper%3A%22+sort%3Aupdated-desc)
`;
}

function t(strings, ...values) {
  return strings.reduce((out, string, i) => {
    const value = values[i - 1];
    if (!value) throw new Error(`Template value #${i}: ${value}`);
    return out + value + string;
  });
}

function getMeetingDays(year, month) {
  var d = new Date(year, month - 1, 1, 12),
      month = d.getMonth(),
      mondays = [];

  d.setDate(1);

  // Get the first Monday in the month
  while (d.getDay() !== 1) {
      d.setDate(d.getDate() + 1);
  }

  let mondayNum = 1;
  // Get all the other Mondays in the month
  while (d.getMonth() === month) {
      if (mondayNum === 2) {
        mondays.push(new Date(d.getTime()));
      }
      mondayNum++;
      d.setDate(d.getDate() + 7);
  }

  return mondays;
}

function getMeetings(year, month) {
  // meetings are at 10am ET
  const hour = 11;
  const minute = 30;
  const length = 60;

  const meetingDays = getMeetingDays(year, month);

  const meetings = [];
  for (const meetingDay of meetingDays) {
      // Get the actual Date instance representing the start time of this meeting
      const dateTime = new Date(meetingDay.getFullYear(), meetingDay.getMonth(), meetingDay.getDate(), hour, minute);

      // Get the full date and time range string
      const endTime = new Date(dateTime);
      endTime.setMinutes(dateTime.getMinutes() + length);
      const dateTimeRange = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "short",
      }).formatRange(dateTime, endTime);
      
      const isoTime = dateTime.toISOString().replace(/[:-]/g, "").slice(0, 15);
      const timeLink = `https://www.timeanddate.com/worldclock/converter.html?iso=${isoTime}&p1=224&p2=179&p3=136&p4=268&p5=367&p6=438&p7=248&p8=240`;
    
      // Date parts for formatting below
      const monthName = dateTime.toLocaleString("en-US", {
        timeZone: "America/New_York",
        month: "long",
      });
      const monthShort = dateTime.toLocaleString("en-US", {
        timeZone: "America/New_York",
        month: "short",
      });
      const month2D = dateTime.toLocaleString("en-US", {
        timeZone: "America/New_York",
        month: "2-digit",
      });
      const day2D = dateTime.toLocaleString("en-US", {
        timeZone: "America/New_York",
        day: "2-digit",
      });
    
      const fullDate = `${year}-${month2D}-${day2D}`;
      const filePath = `agendas/${year}/${month2D}-${monthShort}/${fullDate}.md`;
      const url = `https://github.com/graphql/defer-stream-wg/blob/main/${filePath}`;
    
      meetings.push({
        year,
        month,
        monthName,
        dateTimeRange,
        timeLink,
        filePath,
        fullDate,
        url,
      });
  }
  return meetings;
}
