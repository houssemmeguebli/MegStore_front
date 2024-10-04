import * as powerbi from "powerbi-client";

class PowerBIService {
    constructor() {
        try {
            this.powerbiService = new powerbi.service.Service(
                powerbi.factories.hpmFactory,
                powerbi.factories.wpmpFactory,
                powerbi.factories.routerFactory
            );
        } catch (error) {
            console.error("Error initializing PowerBIService:", error);
        }
    }

    embedReport(container, embedUrl, accessToken) {
        try {
            const embedConfig = {
                type: 'report',
                tokenType: powerbi.models.TokenType.Aad,
                accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyIsImtpZCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNjA0ZjFhOTYtY2JlOC00M2Y4LWFiYmYtZjhlYWY1ZDg1NzMwLyIsImlhdCI6MTcyODA3Nzc0MiwibmJmIjoxNzI4MDc3NzQyLCJleHAiOjE3MjgwODMzOTIsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84WUFBQUFaaElhb1M3UHY0MmdEejVGcGxZdnVuK1VQOFNKb3dObFpzeCs1UjAzQTVlWEhFd1psWG5JUnREQUFYSU5JU2hNd0lUMGxHUjQ0eHNndzMwSnkwZG5mQng5dDZvaFdscHFyclJXaE5hd2xRVT0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiODcxYzAxMGYtNWU2MS00ZmIxLTgzYWMtOTg2MTBhN2U5MTEwIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJNRUdVRUJMSSIsImdpdmVuX25hbWUiOiJIb3Vzc2VtIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiNDEuMjI1LjI4LjIiLCJuYW1lIjoiSG91c3NlbSBNRUdVRUJMSSIsIm9pZCI6IjlhZjY5ZWYzLTBhNjctNDQ4ZC1hYzMwLTAyNmJkNDBiZTg5YiIsInB1aWQiOiIxMDAzMjAwMzA5QkZGNjUyIiwicmgiOiIwLkFUb0FsaHBQWU9qTC1FT3J2X2pxOWRoWE1Ba0FBQUFBQUFBQXdBQUFBQUFBQUFBNkFMMC4iLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJFVi10TFB6MWNGbGlmS3NfbkdET3U2ZzYzWEg0OG5fS1Q2QmFKaTBadlJrIiwidGlkIjoiNjA0ZjFhOTYtY2JlOC00M2Y4LWFiYmYtZjhlYWY1ZDg1NzMwIiwidW5pcXVlX25hbWUiOiJIb3Vzc2VtLk1lZ3VlYmxpQGVzcHJpdC50biIsInVwbiI6IkhvdXNzZW0uTWVndWVibGlAZXNwcml0LnRuIiwidXRpIjoib1ZpczJiMHJfRWFMbGdJdzJnQVlBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19pZHJlbCI6IjEwIDEifQ.trD712u5i5LX63k8CmhDh06u4c6pMCtfaZX2YOQaiC7ejHOEGF0QtexD6cyOuuiHZj_D-EYp9JFhYCleFddetvFCZUHZiYakW_LPQquE3o5gRbROe9rxZHbMOF2CDg-vmuzaN2s1d68LkWW2Z8_zG27gv6-tqaw-Q8q5u373S2M9fmXGRkZzwdHBej7xzmqgTj8aDE6QkYqeHsrTQ91QdQpuYpFEi4Uk-f_LyB7zmPV-iQmFN_nXjD2Mz0pOhOBiD1B6uJ2SpgV6sCo8GFLCM_LomwnSCdY_WPoRZBGPKipBzjzuXLeP8hiPaOqBLpidlkfIGxVycFR_ymhFdZk_0g',
                embedUrl: embedUrl,
                id: 'f4b025bd-407e-4ddf-bc9f-ff5a5bd11c96', // Report ID
                settings: {
                    panes: {
                        filters: {
                            visible: false,
                        },
                        pageNavigation: {
                            visible: true,
                        },
                    },
                },
            };

            // Embed the report using the Power BI service
            this.powerbiService.embed(container, embedConfig);
        } catch (error) {
            console.error("Error embedding Power BI report:", error);
        }
    }

    resetReport(container) {
        try {
            this.powerbiService.reset(container);
        } catch (error) {
            console.error("Error resetting Power BI report:", error);
        }
    }
}

export default new PowerBIService();
