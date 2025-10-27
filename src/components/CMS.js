import React, {useEffect, useState} from 'react';

const CMSSection = () => {
    const [newContent, setNewContent] = useState({
        title: '',
        body: '',
        image: null,
        imageUrl: ''
    });
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);

    // Fetch initial content
    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/contents');
            const data = await res.json();
            setContents(data);
        } catch (err) {
            setError('Failed to load contents');
        } finally {
            setLoading(false);
        }
    };

    const saveContent = async () => {
        try {
            setLoading(true);

            // Prepare payload with image data
            const payload = {
                title: newContent.title,
                body: newContent.body,
                imageUrl: newContent.imageUrl
            };

            const response = await fetch(
                editingId ? `/api/contents/${editingId}` : '/api/contents',
                {
                    method: editingId ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) throw new Error('Failed to save content');

            // Reset form and refresh list
            setNewContent({ title: '', body: '', image: null, imageUrl: '' });
            setEditingId(null);
            fetchContents();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const editContent = (content) => {
        setNewContent({
            title: content.title,
            body: content.body,
            image: null,
            imageUrl: content.imageUrl || ''
        });
        setEditingId(content.id);
    };

    const deleteContent = async (id) => {
        try {
            setLoading(true);
            await fetch(`/api/contents/${id}`, { method: 'DELETE' });
            fetchContents();
        } catch (err) {
            setError('Failed to delete content');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full h-fit space-y-6 bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold">Content Management</h1>

            {/* Form for adding/updating content */}
            <div className="flex flex-col space-y-3">
                <input
                    className="p-2 border rounded"
                    type="text"
                    placeholder="Title"
                    value={newContent.title}
                    onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                />

                {/* Image Upload Input */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files[0]) {
                            const file = e.target.files[0];
                            setNewContent(prev => ({ ...prev, image: file }));

                            // Convert image to base64 for preview/storage
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setNewContent(prev => ({ ...prev, imageUrl: reader.result }));
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                />

                {/* Image Preview */}
                {newContent.imageUrl && (
                    <div>
                        <img
                            src={newContent.imageUrl}
                            alt="Preview"
                            className="max-w-xs max-h-32 object-cover"
                        />
                    </div>
                )}

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
                        {c.imageUrl && (
                            <img
                                src={c.imageUrl}
                                alt={c.title}
                                className="max-w-xs max-h-32 object-cover"
                            />
                        )}
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