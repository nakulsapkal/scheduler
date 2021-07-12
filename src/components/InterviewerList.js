import React from "react";
import PropTypes from "prop-types";

import "components/InterviewerList.scss";

import InterviewerListItem from "./InterviewerListItem";

function InterviewerList(props) {
  const interviewers = props.interviewers.map((interviewer) => (
    <InterviewerListItem
      key={interviewer.id}
      name={interviewer.name}
      avatar={interviewer.avatar}
      selected={interviewer.id === props.interviewer}
      setInterviewer={(event) => props.setInterviewer(interviewer.id)}
    />
  ));

  return <ul className="interviewers__list">{interviewers}</ul>;
}

InterviewerList.propTypes = {
  interviewers: PropTypes.string.isRequired,
};

export default InterviewerList;
