import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const CMSSection = () => {
    const [newContent, setNewContent] = useState({ title: "", body: "" });
    const [editingId, setEditingId] = useState(null);
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch initial content from backend
    useEffect(() => {
        const fetchContents = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/content/');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setContents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContents();
    }, []);

    // Save content (add or update)
    const saveContent = async () => {
        setLoading(true);
        setError(null);
        try {
            let updatedOrNewContent;
            if (editingId) {
                const response = await fetch(`/api/content/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newContent),
                });
                if (!response.ok) throw new Error(`Failed to update: ${response.statusText}`);
                updatedOrNewContent = await response.json();
                setContents(contents.map(c => c.id === editingId ? updatedOrNewContent : c));
            } else {
                const response = await fetch('/api/content/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newContent),
                });
                if (!response.ok) throw new Error(`Failed to add: ${response.statusText}`);
                updatedOrNewContent = await response.json();
                setContents([...contents, updatedOrNewContent]);
            }

            setNewContent({ title: "", body: "" });
            setEditingId(null);
        } catch (err) {
            setError(err.message);
            console.error("Error saving content:", err);
        } finally {
            setLoading(false);
        }
    };


    // Edit content
    const editContent = (content) => {
        setNewContent({ title: content.title, body: content.body });
        setEditingId(content.id);
    };

    // Delete content
    const deleteContent = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/content/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error(`Failed to delete: ${response.statusText}`);

            setContents(contents.filter(c => c.id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full h-fit space-y-6 bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold">Content Management</h1>

            {/* Form for adding/updating */}
            <div className="flex flex-col space-y-3">
                <input
                    className="p-2 border rounded"
                    type="text"
                    placeholder="Title"
                    value={newContent.title}
                    onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                />
                <textarea
                    className="p-2 border rounded"
                    placeholder="Body"
                    value={newContent.body}
                    onChange={(e) => setNewContent({...newContent, body: e.target.value})}
                />
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={saveContent}
                    disabled={loading}
                >
                    {editingId ? "Update Content" : "Add Content"}
                </button>
            </div>

            {/* Displaying all content */}
            <div className="space-y-4">
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {contents.map((c) => (
                    <div
                        key={c.id}
                        className="p-4 border rounded shadow-sm bg-gray-50 flex flex-col space-y-2"
                    >
                        <h2 className="text-xl font-semibold">{c.title}</h2>
                        <p>{c.body}</p>
                        <div className="flex space-x-2">
                            <button
                                className="px-3 py-1 bg-yellow-500 text-white rounded"
                                onClick={() => editContent(c)}
                                disabled={loading}
                            >
                                Edit
                            </button>
                            <button
                                className="px-3 py-1 bg-red-500 text-white rounded"
                                onClick={() => deleteContent(c.id)}
                                disabled={loading}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {contents.length === 0 && !loading && !error && (
                    <p className="text-gray-500 italic">No content available</p>
                )}

            </div>
        </div>
    );
};

export default CMSSection;