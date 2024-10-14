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
                accessToken:  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyIsImtpZCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNjA0ZjFhOTYtY2JlOC00M2Y4LWFiYmYtZjhlYWY1ZDg1NzMwLyIsImlhdCI6MTcyODU1MjM5OSwibmJmIjoxNzI4NTUyMzk5LCJleHAiOjE3Mjg1NTYzNzcsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84WUFBQUF4MmF1em1pNzRvbUdnSVRkVXpiMEtHZnVqVjFYK0RqK0cwNEk5VG1BRzlQUGw0KzVmT1hYYTArSlZIYWtlb0kxcTNQYlhXK0M4Tys4aURrZ3V4L3BibFNUNnV5TkFWMUJhWm5mcUhyVkxiND0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiODcxYzAxMGYtNWU2MS00ZmIxLTgzYWMtOTg2MTBhN2U5MTEwIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJNRUdVRUJMSSIsImdpdmVuX25hbWUiOiJIb3Vzc2VtIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTk2LjIzNS4xNjEuNjIiLCJuYW1lIjoiSG91c3NlbSBNRUdVRUJMSSIsIm9pZCI6IjlhZjY5ZWYzLTBhNjctNDQ4ZC1hYzMwLTAyNmJkNDBiZTg5YiIsInB1aWQiOiIxMDAzMjAwMzA5QkZGNjUyIiwicmgiOiIwLkFUb0FsaHBQWU9qTC1FT3J2X2pxOWRoWE1Ba0FBQUFBQUFBQXdBQUFBQUFBQUFBNkFMMC4iLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJFVi10TFB6MWNGbGlmS3NfbkdET3U2ZzYzWEg0OG5fS1Q2QmFKaTBadlJrIiwidGlkIjoiNjA0ZjFhOTYtY2JlOC00M2Y4LWFiYmYtZjhlYWY1ZDg1NzMwIiwidW5pcXVlX25hbWUiOiJIb3Vzc2VtLk1lZ3VlYmxpQGVzcHJpdC50biIsInVwbiI6IkhvdXNzZW0uTWVndWVibGlAZXNwcml0LnRuIiwidXRpIjoiWkc1WUY4bmtxRTJWNzdqblFIZ2tBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19pZHJlbCI6IjEgMzAifQ.JAoxGzHmT-3oF_Rj-uErYIRW4lqji_DzxLaxuYJ5zXEcuqML5IMGmeHfuyGYtQezILuV8_RB7qEOG0KxcvORDk6a4kR9XewB0gs9-ikrxR6r2yZwYALkxiMqaVL_r_UUnqJL--_6-SBAK2cPBZaEcCi9J8oyz4QFpFqhD0e340SNivselEbblA9tThgyo8Exy7RBE-83urPauWTYhQdrCTA-3BLbUG0Npk6e0-7TkpNa048qtbKiu066vPGmLII3aPzWbPE9CxhAlKifJVleTzjt6uwFJ4iUbP1_hXcNYl1AE1tPe-JjRyKbbwl0J_YoLcpRQ8IMGMn3o5xnXGp0RQ',
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
