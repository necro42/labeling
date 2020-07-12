import React from 'react';
import { withCookies } from 'react-cookie';
import AnalysisManagementPage from 'components/pagesAdmin/analysisManagementPage';

const AdminAnalysisManagerPage = ({ cookies, history }) => {
    return (
        <AnalysisManagementPage/>
    );
};

export default withCookies(AdminAnalysisManagerPage);